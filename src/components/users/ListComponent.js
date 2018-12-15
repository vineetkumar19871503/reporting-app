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
      'users': [],
      'cols': [
        {
          'Header': 'Email',
          'accessor': 'email'
        },
        {
          'Header': 'Name',
          'accessor': 'name'
        }
      ]
    };
  }
  componentDidMount() {
    const self = this;
    axios.get(config.apiUrl + 'users/list', {
      headers: { 'Authorization': 'Bearer ' + self.props.user.token }
    })
      .then(res => {
        self.setState({'users': res.data.data});
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
              <strong>Users</strong>
              <Button size="sm" className="float-right" color="primary" onClick={() => this.props.history.push('/users/add')}>Add User</Button>
            </CardHeader>
            <CardBody>
              <ToastContainer store={ToastStore} />
              <ReactTable
                data={this.state.users}
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