import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, ToastStore } from 'react-toasts';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap';
import config from '../../config.js';
class AddComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'search': {
        'start_date': null,
        'end_date': null
      },
      'records': [],
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'number_of_poles': '',
        'address': '',
        'an_jn_office': '',
        'staywire': ''
      },
      'errors': {},
      'cols': [
        {
          'Header': 'Date',
          'accessor': 'display_date'
        },
        {
          'Header': 'No Of Pole',
          'accessor': 'number_of_poles'
        },
        {
          'Header': 'Address',
          'accessor': 'address'
        },
        {
          'Header': 'AN/JN Office',
          'accessor': 'an_jn_office'
        },
        {
          'Header': 'Staywire',
          'accessor': 'staywire'
        },
        {
          'Header': 'Actions',
          Cell: row => (
            <Row>
              <Col md="6"><Button block size="sm" color="success" onClick={() => this.updateRecord(row)}>Edit</Button></Col>
            </Row>
          )
        }
      ]
    };
    this.saveFormData = this.saveFormData.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.searchData = this.searchData.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
  }

  componentDidMount() {
    const self = this;
    document.title = "Discom Pole - Add";
    self.getRecords();
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

  resetForm() {
    this.setState({
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'number_of_poles': '',
        'address': '',
        'an_jn_office': '',
        'staywire': ''
      }
    });
  }

  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
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
    axios.get(config.apiUrl + 'discompole/list', p)
      .then(res => {
        self.showLoader(false);
        const records = res.data.data;
        self.setState({ 'records': records });
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
  validateForm(cb) {
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'number_of_poles', formIsValid);
    formIsValid = this._validateField('number', 'number_of_poles', formIsValid);
    formIsValid = this._validateField('required', 'address', formIsValid);
    formIsValid = this._validateField('required', 'an_jn_office', formIsValid);
    formIsValid = this._validateField('required', 'staywire', formIsValid);
    this.setState({ 'errors': this.errors });
    if (formIsValid) {
      cb();
    }
  }
  _validateField(type = 'required', name, formIsValid) {
    let fields = this.state.fields;
    let isFieldValid = formIsValid;
    if (this.errors[name]) {
      return;
    }
    switch (type) {
      case 'required': {
        if (!fields[name] || !fields[name].trim().length) {
          isFieldValid = false;
          this.errors[name] = "This field cannot be empty";
        }
        break;
      }
      case 'number': {
        const numVal = fields[name].toString();
        if (!(numVal.match(/^-?\d*(\.\d+)?$/))) {
          isFieldValid = false;
          this.errors[name] = "Please enter a valid number";
        }
        break;
      }
      default: return;
    }
    return isFieldValid;
  }

  saveFormData(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      self.showLoader();
      const fields = self.state.fields;
      fields.date = moment().format('MM/DD/YYYY');
      axios.post(
        config.apiUrl + 'discompole/add',
        fields,
        {
          'headers': {
            'Authorization': 'Bearer ' + self.props.user.token
          }
        }
      )
        .then(res => {
          self.showLoader(false);
          if (res.data.is_err) {
            ToastStore.error(res.data.message);
          } else {
            ToastStore.success(res.data.message);
            self.resetForm();
            self.clearSearch();
            self.getRecords();
          }
        })
        .catch(err => {
          self.showLoader(false);
          let errorMsg = err.message;
          if (err.response && err.response.data) {
            errorMsg = err.response.data.message;
          }
          ToastStore.error(errorMsg);
        });
    });
  }

  clearSearch() {
    this.setState({
      'search': {
        'start_date': null,
        'end_date': null
      }
    });
    this.getRecords();
  }

  searchData(e) {
    e.preventDefault();
    this.getRecords(this.state.search);
  }

  updateRecord(data) {

  }

  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <ToastContainer store={ToastStore} />
            <CardHeader>
              <strong>Discom Pole - Add</strong>
            </CardHeader>
            <Form onSubmit={this.saveFormData}>
              <CardBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="date">Date</Label><br />
                      <div className="custom-form-field">
                        <Input readOnly="readonly" type="text" id="date" value={this.state.fields.date} />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="number_of_poles">No. Of Pole</Label>
                      <Input type="text" id="number_of_poles" value={this.state.fields.number_of_poles} onChange={e => this.changeInput('number_of_poles', e.target.value)} placeholder="Enter No. Of Poles" />
                      <span className="form-err">{this.state.errors["number_of_poles"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="address">Address</Label>
                      <Input type="textarea" id="address" value={this.state.fields.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                      <span className="form-err">{this.state.errors["address"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="net_plan">AN/JN Office</Label>
                      <Input type="text" id="an_jn_office" value={this.state.fields.an_jn_office} onChange={e => this.changeInput('an_jn_office', e.target.value)} placeholder="Enter An/JN Office" />
                      <span className="form-err">{this.state.errors["an_jn_office"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="staywire">Staywire</Label>
                      <Input type="text" id="staywire" value={this.state.fields.staywire} onChange={e => this.changeInput('staywire', e.target.value)} placeholder="Enter Staywire" />
                      <span className="form-err">{this.state.errors["staywire"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">Submit</Button>&nbsp;
                <Button type="button" onClick={this.resetForm} size="sm" color="danger">Reset</Button>
              </CardFooter>
            </Form>
          </Card>

          {/* =================== Tabble And Search Form Start =================== */}
          <Card>
            <CardBody>
              <Form onSubmit={this.searchData}>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="start_date">Date From</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="Enter From Date"
                        selected={this.state.search.start_date}
                        onChange={date => this.changeInput('start_date', date, 'serach')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="end_date">Date To</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="Enter To Date"
                        selected={this.state.search.end_date}
                        onChange={date => this.changeInput('end_date', date, 'serach')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <br />
                    <div style={{ paddingTop: '6px' }}>
                      <Button color="primary" size="sm" className="px-4">Search</Button>&nbsp;
                      <Button color="danger" size="sm" onClick={this.clearSearch} className="px-4">Clear</Button>
                    </div>
                  </Col>
                </Row>
              </Form>
              <ReactTable
                data={this.state.records}
                columns={this.state.cols}
                defaultPageSize={10}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
          {/* =================== Tabble And Search Form End =================== */}
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
export default connect(mapStateToProps)(AddComponent);