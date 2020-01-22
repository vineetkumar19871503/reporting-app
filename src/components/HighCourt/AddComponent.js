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
  Row,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import config from '../../config.js';
class AddComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'is_update': false,
      'show_modal': false,
      'is_edit_bank_disabled': false,
      'is_bank_disabled': false,
      'update_index': 0,
      'search': {
        'start_date': null,
        'end_date': null,
        'search_card_type': '',
        'search_bank_name': ''
      },
      'records': [],
      'edit_fields': {
        'date': moment().format('DD/MM/YYYY'),
        'amount': '',
        'card_type': '',
        'bank_name': '',
        'description': ''
      },
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'amount': '',
        'card_type': '',
        'bank_name': '',
        'description': ''
      },
      'errors': {},
      'update_errors': {},
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
          'Header': 'Bank Name',
          'accessor': 'bank_name'
        },
        {
          'Header': 'Description',
          'accessor': 'description'
        },
        {
          'Header': 'Actions',
          Cell: row => (
            <Row>
              <Col md="12"><Button block size="sm" color="success" onClick={() => { this.setState({ 'update_index': row.index, 'edit_fields': row.original, 'is_edit_bank_disabled': row.original.card_type === 'Debit' }, () => { this.onCardTypeSelect(row.original.card_type, 'edit'); this.toggleModal(); }); }}>Edit</Button></Col>
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
    this.toggleModal = this.toggleModal.bind(this);
    this.onCardTypeSelect = this.onCardTypeSelect.bind(this);
  }

  toggleModal() {
    let show_modal = !this.state.show_modal;
    let is_update = show_modal === true;
    this.setState({ show_modal, is_update });
  }

  componentDidMount() {
    const self = this;
    document.title = "High Court - Add";
    self.getRecords();
  }

  changeInput(field, value, inputType) {
    const state = Object.assign({}, this.state);
    if (inputType) {
      state['search'][field] = value;
    } else if (this.state.is_update) {
      state['edit_fields'][field] = value;
    } else {
      state['fields'][field] = value;
    }
    this.setState(state);
  }

  resetForm(e) {
    this.setState({
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'amount': '',
        'card_type': '',
        'bank_name': '',
        'description': ''
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
    axios.get(config.apiUrl + 'highcourt/list', p)
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
    if ((this.state.is_update && !this.state.is_edit_bank_disabled) || (!this.state.is_update && !this.state.is_bank_disabled)) {
      formIsValid = this._validateField('required', 'bank_name', formIsValid);
    }
    formIsValid = this._validateField('required', 'description', formIsValid);
    this.state.is_update ? this.setState({ 'update_errors': this.errors }) : this.setState({ 'errors': this.errors });
    if (formIsValid) {
      cb();
    }
  }

  onCardTypeSelect(value, formType = "add") {
    let isDisabled = value === "Debit";
    if (formType === "add") {
      const formFields = this.state.fields;
      if (isDisabled) {
        formFields.bank_name = "";
      }
      this.setState({ "is_bank_disabled": isDisabled, "fields": formFields });
    } else {
      const formFields = this.state.edit_fields;
      if (isDisabled) {
        formFields.bank_name = "";
      }
      this.setState({ "is_edit_bank_disabled": isDisabled, "edit_fields": formFields });
    }
  }

  _validateField(type = 'required', name, formIsValid) {
    let fields = this.state.is_update ? this.state.edit_fields : this.state.fields;
    let isFieldValid = formIsValid;
    if (this.errors[name]) {
      return;
    }
    switch (type) {
      case 'required': {
        if (!fields[name] || !fields[name].toString().trim().length) {
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
      fields.created_by = self.props.user._id;
      axios.post(
        config.apiUrl + 'highcourt/add',
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
        'search_bank_name': ''
      }
    });
    this.getRecords();
  }

  searchData(e) {
    e.preventDefault();
    this.getRecords(this.state.search);
  }

  updateRecord(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      self.showLoader();
      const fields = Object.assign({}, self.state.edit_fields);
      fields.reminder_date = moment(new Date(fields.reminder_date)).format("MM/DD/YYYY");
      // fields.date = moment().format('MM/DD/YYYY');
      fields.display_date = moment(fields.date).format("DD/MM/YYYY");
      axios.post(
        config.apiUrl + 'highcourt/edit',
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
            const st = self.state;
            const records = st.records;
            const newRecords = [];
            let counter = 0;
            for (let record of records) {
              if (counter === st.update_index) {
                record = fields;
              }
              const newRecord = { ...record };
              newRecords.push(newRecord);
              counter++;
            }
            self.setState({ records: newRecords });
            self.toggleModal();
            ToastStore.success(res.data.message);
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

  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <ToastContainer store={ToastStore} />
            <CardHeader>
              <strong>High Court - Add</strong>
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
                      <Label htmlFor="card_type">Debit/Credit</Label>
                      <Input type="select" id="card_type" value={this.state.fields.card_type} onChange={e => { this.changeInput('card_type', e.target.value); this.onCardTypeSelect(e.target.value); }}>
                        <option value="">-- Select Card Type --</option>
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </Input>
                      <span className="form-err">{this.state.errors["card_type"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="amount">Amount</Label>
                      <Input type="text" id="amount" value={this.state.fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                      <span className="form-err">{this.state.errors["amount"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input type="select" disabled={this.state.is_bank_disabled} id="bank_name" value={this.state.fields.bank_name} onChange={e => this.changeInput('bank_name', e.target.value)}>
                      <option value="">-- Select Bank Name --</option>
                      <option value="SBI">SBI</option>
                      <option value="IndusInd Bank">IndusInd Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Cash">Cash</option>
                    </Input>
                    <span className="form-err">{this.state.errors["bank_name"]}</span>
                  </Col>
                  <Col md="6">
                    <Label htmlFor="description">Description</Label>
                    <Input type="textarea" id="description" value={this.state.fields.description} onChange={e => this.changeInput('description', e.target.value)} />
                    <span className="form-err">{this.state.errors["description"]}</span>
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
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="start_date">From Date</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="Enter From Date"
                        selected={this.state.search.start_date}
                        onChange={date => this.changeInput('start_date', date, 'search')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="end_date">To Date</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="Enter To Date"
                        selected={this.state.search.end_date}
                        onChange={date => this.changeInput('end_date', date, 'search')}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="search_card_type">Debit/Credit</Label>
                      <Input type="select" id="search_card_type" value={this.state.search.search_card_type} onChange={e => this.changeInput('search_card_type', e.target.value, 'search')}>
                        <option value="">All</option>
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="9">
                    <FormGroup>
                      <Label htmlFor="search_bank_name">Bank Name</Label>
                      <Input type="select" id="search_bank_name" value={this.state.search.search_bank_name} onChange={e => this.changeInput('search_bank_name', e.target.value, 'search')}>
                        <option value="">All</option>
                        <option value="SBI">SBI</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Cash">Cash</option>
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
                pageSize={this.state.records.length}
                showPagination={false}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
          {/* =================== Table And Search Form End =================== */}

          {/* ===================== Edit Modal Start =================== */}
          <Modal isOpen={this.state.show_modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Edit</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.updateRecord}>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="date">Date</Label><br />
                        <div className="custom-form-field">
                          <Input readOnly="readonly" type="text" id="date" value={this.state.edit_fields.date} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="amount">Amount</Label>
                        <Input type="text" id="amount" value={this.state.edit_fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                        <span className="form-err">{this.state.update_errors["amount"]}</span>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="card_type">Debit/Credit</Label>
                        <Input type="select" id="card_type" value={this.state.edit_fields.card_type} onChange={e => { this.changeInput('card_type', e.target.value); this.onCardTypeSelect(e.target.value, "edit"); }}>
                          <option value="">-- Select Card Type --</option>
                          <option value="Debit">Debit</option>
                          <option value="Credit">Credit</option>
                        </Input>
                        <span className="form-err">{this.state.update_errors["card_type"]}</span>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input type="select" id="bank_name" disabled={this.state.is_edit_bank_disabled} value={this.state.edit_fields.bank_name} onChange={e => this.changeInput('bank_name', e.target.value)}>
                        <option value="">-- Select Bank Name --</option>
                        <option value="SBI">SBI</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Cash">Cash</option>
                      </Input>
                      <span className="form-err">{this.state.update_errors["bank_name"]}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Label htmlFor="description">Description</Label>
                      <Input type="textarea" id="description" value={this.state.edit_fields.description} onChange={e => this.changeInput('description', e.target.value)} />
                      <span className="form-err">{this.state.update_errors["description"]}</span>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary">Update</Button>&nbsp;
                <Button type="button" onClick={this.toggleModal} size="sm" color="danger">Cancel</Button>
                </CardFooter>
              </Form>
            </ModalBody>
          </Modal>
          {/* ===================== Edit Modal Start =================== */}
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