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
        'end_date': null,
        'search_card_type': '',
        'search_entry_type': ''
      },
      'records': [],
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'amount': '',
        'card_type': 'Debit',
        'description': '',
        'entry_type': ''
      },
      'errors': {},
      'cols': [
        {
          'Header': 'Date',
          'accessor': 'display_date'
        },
        {
          'Header': 'Debit/Credit',
          'accessor': 'card_type'
        },
        {
          'Header': 'Amount',
          'accessor': 'amount'
        },
        {
          'Header': 'Description',
          'accessor': 'description'
        },
        {
          'Header': 'Entry Type',
          'accessor': 'entry_type'
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
    document.title = "Yavukush - Add";
    this.getRecords();
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
        'amount': '',
        'card_type': 'Debit',
        'description': '',
        'entry_type': ''
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
    axios.get(config.apiUrl + 'yavukush/list', p)
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
    formIsValid = this._validateField('required', 'amount', formIsValid);
    formIsValid = this._validateField('number', 'amount', formIsValid);
    formIsValid = this._validateField('required', 'card_type', formIsValid);
    formIsValid = this._validateField('required', 'description', formIsValid);
    formIsValid = this._validateField('required', 'entry_type', formIsValid);
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
        config.apiUrl + 'yavukush/add',
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
        'end_date': null,
        'search_card_type': '',
        'search_entry_type': ''
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
              <strong>Yavukush - Add</strong>
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
                      <Label htmlFor="amount">Amount</Label>
                      <Input type="text" id="amount" value={this.state.fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                      <span className="form-err">{this.state.errors["amount"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="card_type">Debit/Credit</Label>
                      <Input type="select" id="card_type" value={this.state.fields.card_type} onChange={e => this.changeInput('card_type', e.target.value)}>
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </Input>
                      <span className="form-err">{this.state.errors["card_type"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <Input type="textarea" id="description" value={this.state.fields.description} onChange={e => this.changeInput('description', e.target.value)} placeholder="Enter Description" />
                      <span className="form-err">{this.state.errors["description"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="entry_type">Entry Type</Label>
                      <Input type="select" id="entry_type" value={this.state.fields.entry_type} onChange={e => this.changeInput('entry_type', e.target.value)}>
                        <option value="">-- Select Entry Type --</option>
                        <option value="Machiya">Machiya</option>
                        <option value="High Court">High Court</option>
                        <option value="Discom">Discom</option>
                        <option value="Discom Pole">Discom Pole</option>
                        <option value="Yavukush">Yavukush</option>
                        <option value="BSNL Cable">BSNL Cable</option>
                      </Input>
                      <span className="form-err">{this.state.errors["entry_type"]}</span>
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

          {/* =================== Table And Search Form Start =================== */}
          <Card>
            <CardBody>
              <Form onSubmit={this.searchData}>
                <Row>
                  <Col md="2">
                    <FormGroup>
                      <Label htmlFor="start_date">From Date</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="From Date"
                        selected={this.state.search.start_date}
                        onChange={date => this.changeInput('start_date', date, 'search')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label htmlFor="end_date">To Date</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="To Date"
                        selected={this.state.search.end_date}
                        onChange={date => this.changeInput('end_date', date, 'search')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label htmlFor="search_card_type">Debit/Credit</Label>
                      <Input type="select" id="search_card_type" value={this.state.fields.search_card_type} onChange={e => this.changeInput('search_card_type', e.target.value, 'search')}>
                        <option value="">All</option>
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="search_entry_type">Entry Type</Label>
                      <Input type="select" id="search_entry_type" value={this.state.fields.search_entry_type} onChange={e => this.changeInput('search_entry_type', e.target.value, 'search')}>
                        <option value="">All</option>
                        <option value="Machiya">Machiya</option>
                        <option value="High Court">High Court</option>
                        <option value="Discom">Discom</option>
                        <option value="Discom Pole">Discom Pole</option>
                        <option value="Yavukush">Yavukush</option>
                        <option value="BSNL Cable">BSNL Cable</option>
                      </Input>
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
                data={this.state.records}
                columns={this.state.cols}
                defaultPageSize={10}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
          {/* =================== Table And Search Form End =================== */}


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