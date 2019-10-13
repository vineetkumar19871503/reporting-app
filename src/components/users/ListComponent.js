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
  Row,
  Form,
  FormGroup,
  Label,
  Input
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
      'search': {
        'search_name': '',
        'search_email': '',
        'search_address': ''
      },
      'cols': [
        {
          'Header': 'Name',
          'accessor': 'full_name'
        },
        {
          'Header': 'Email',
          'accessor': 'email'
        },
        {
          'Header': 'Address',
          'accessor': 'address'
        },
        {
          'Header': 'Actions',
          Cell: row => (
            <div className='text-center'><Button size="sm" color="primary" onClick={() => this.navToEditPage(row)}>Edit</Button></div>
          )
        }
      ]
    };
    this.searchData = this.searchData.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  clearSearch() {
    this.setState({
      'search': {
        'search_name': '',
        'search_email': '',
        'search_address': ''
      }
    });
    this.getRecords();
  }

  searchData(e) {
    e.preventDefault();
    this.getRecords(this.state.search);
  }

  navToEditPage(data) {
    this.props.history.push('/users/edit/' + data.original._id);
  }

  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }

  changeInput(field, value, inputType) {
    const state = Object.assign({}, this.state);
    if (inputType) {
      state['search'][field] = value;
    } else {
      state['fields'][field] = value;
    }
    this.setState(state);
  }

  componentDidMount() {
    document.title = "Users";
    this.getRecords();
  }

  getRecords(params) {
    const self = this;
    const p = {
      headers: { 'Authorization': 'Bearer ' + self.props.user.token }
    };
    if (params) {
      p.params = params;
    }
    self.showLoader();
    axios.get(config.apiUrl + 'users/list', p)
      .then(res => {
        self.showLoader(false);
        self.setState({ 'users': res.data.data });
      })
      .catch(err => {
        self.showLoader(false);
        let errorMsg = err.message;
        if (err.response && err.response.data) {
          errorMsg = err.response.data.message;
        }
        ToastStore.error(errorMsg);
      });
  }

  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <strong>Users</strong>
              <Button size="sm" className="float-right" color="success" onClick={() => this.props.history.push('/users/add')}>Add User</Button>
            </CardHeader>
            <CardBody>
              <ToastContainer store={ToastStore} />
              <Form onSubmit={this.searchData}>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="search_name">Name</Label><br />
                      <Input type="text" id="search_name" value={this.state.search.search_name} onChange={e => this.changeInput('search_name', e.target.value, 'search')} />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="search_email">Email</Label><br />
                      <Input type="text" id="search_email" value={this.state.search.search_email} onChange={e => this.changeInput('search_email', e.target.value, 'search')} />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="search_address">Address</Label><br />
                      <Input type="text" id="search_address" value={this.state.search.search_address} onChange={e => this.changeInput('search_address', e.target.value, 'search')} />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                  <br />
                    <div style={{ paddingTop: '6px', textAlign: 'right' }}>
                      <Button color="primary" size="sm" className="px-4">Search</Button>&nbsp;
                      <Button color="danger" size="sm" onClick={this.clearSearch} className="px-4">Clear</Button>
                    </div>
                  </Col>
                </Row>
              </Form>
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