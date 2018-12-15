import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, ToastStore } from 'react-toasts';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";
import config from '../../config.js';
class ListComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'bills': [],
      'cols': [
        {
          'Header': 'K Number',
          'accessor': 'k_number'
        },
        {
          'Header': 'Amount',
          'accessor': 'amount'
        },
        {
          'Header': 'Payment Mode',
          'accessor': 'payment_mode'
        },
        {
          'Header': 'Consumer Name',
          'accessor': 'consumer_name'
        },
        {
          'Header': 'Receipt Number',
          'accessor': 'receipt_number'
        }
      ]
    };
  }
  componentDidMount() {
    const self = this;
    axios.get(config.apiUrl + 'bills/list', {
      headers: { 'Authorization': 'Bearer ' + self.props.user.token }
    })
      .then(res => {
        self.setState({'bills': res.data.data});
      })
      .catch(err => {
        ToastStore.error(err.message);
      });
  }
  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <strong>Bills</strong>
              <Button size="sm" className="float-right" color="primary" onClick={() => this.props.history.push('/bills/add')}>Add Bill</Button>
            </CardHeader>
            <CardBody>
              <ToastContainer store={ToastStore} />
              <ReactTable
                data={this.state.bills}
                columns={this.state.cols}
                defaultPageSize={10}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>;
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(ListComponent);