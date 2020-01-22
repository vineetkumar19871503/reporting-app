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
      'update_index': 0,
      'records': [],
      'search': {
        'search_customer_name': '',
        'search_mobile_number': '',
        'search_status': ''
      },
      'edit_fields': {
        'date': moment().format('DD/MM/YYYY'),
        'customer_name': '',
        'father_name': '',
        'mobile_number': '',
        'address': '',
        'net_plan': '',
        'reminder_date': null,
        'status': ''
      },
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'customer_name': '',
        'father_name': '',
        'mobile_number': '',
        'address': '',
        'net_plan': '',
        'reminder_date': null,
        'status': ''
      },
      'errors': {},
      'update_errors': {},
      'cols': [
        {
          'Header': 'Date',
          'accessor': 'display_date'
        },
        {
          'Header': 'Customer Name',
          'accessor': 'customer_name'
        },
        {
          'Header': 'Mobile',
          'accessor': 'mobile_number'
        },
        {
          'Header': 'Address',
          'accessor': 'address'
        },
        {
          'Header': 'Net Plan',
          'accessor': 'net_plan'
        },
        {
          'Header': 'Reminder Date',
          'accessor': 'display_reminder_date'
        },
        {
          'Header': 'Source',
          'accessor': 'source'
        },
        {
          'Header': 'Status',
          'accessor': 'status'
        },
        {
          'Header': 'Actions',
          Cell: row => (
            <Row>
              <Col md="12"><Button block size="sm" color="success" onClick={() => { this.setState({ 'update_index': row.index, 'edit_fields': row.original }, () => { this.toggleModal(); }); }}>Edit</Button></Col>
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
  }

  toggleModal() {
    let show_modal = !this.state.show_modal;
    let is_update = show_modal === true;
    this.setState({ show_modal, is_update });
  }

  componentDidMount() {
    document.title = "BSNL Cable - Add";
    this.getRecords();
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

  resetForm() {
    this.setState({
      'errors': {},
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'customer_name': '',
        'father_name': '',
        'mobile_number': '',
        'address': '',
        'net_plan': '',
        'reminder_date': null,
        'status': ''
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
    axios.get(config.apiUrl + 'bsnlcable/list', p)
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
    formIsValid = this._validateField('required', 'customer_name', formIsValid);
    formIsValid = this._validateField('required', 'father_name', formIsValid);
    formIsValid = this._validateField('required', 'mobile_number', formIsValid);
    formIsValid = this._validateField('required', 'address', formIsValid);
    formIsValid = this._validateField('required', 'net_plan', formIsValid);
    formIsValid = this._validateField('required', 'reminder_date', formIsValid);
    formIsValid = this._validateField('required', 'status', formIsValid);
    this.state.is_update ? this.setState({ 'update_errors': this.errors }) : this.setState({ 'errors': this.errors });
    if (formIsValid) {
      cb();
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
      const fields = Object.assign({}, self.state.fields);
      fields.reminder_date = moment(new Date(fields.reminder_date)).format("MM/DD/YYYY");
      fields.date = moment().format('MM/DD/YYYY');
      fields.created_by = self.props.user._id;
      axios.post(
        config.apiUrl + 'bsnlcable/add',
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
        'search_customer_name': '',
        'search_mobile_number': '',
        'search_status': ''
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
      fields.display_reminder_date = moment(fields.reminder_date).format("DD/MM/YYYY");
      axios.post(
        config.apiUrl + 'bsnlcable/edit',
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
              <strong>BSNL Cable - Add</strong>
            </CardHeader>
            <Form onSubmit={this.saveFormData}>
              <CardBody>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="date">Date</Label><br />
                      <div className="custom-form-field">
                        <Input readOnly="readonly" type="text" id="date" value={this.state.fields.date} />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="customer_name">Customer Name</Label>
                      <Input type="text" id="customer_name" value={this.state.fields.customer_name} onChange={e => this.changeInput('customer_name', e.target.value)} placeholder="Enter Customer Name" />
                      <span className="form-err">{this.state.errors["customer_name"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="father_name">Father Name</Label>
                      <Input type="text" id="father_name" value={this.state.fields.father_name} onChange={e => this.changeInput('father_name', e.target.value)} placeholder="Enter Father's Name" />
                      <span className="form-err">{this.state.errors["father_name"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="mobile_number">Mobile No</Label>
                      <Input type="text" id="mobile_number" value={this.state.fields.mobile_number} onChange={e => this.changeInput('mobile_number', e.target.value)} placeholder="Enter Mobile Number" />
                      <span className="form-err">{this.state.errors["mobile_number"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="reminder_date">Reminder Date</Label>
                      <DatePicker
                        id="reminder_date"
                        className='form-control'
                        placeholderText="Enter Reminder Date"
                        selected={this.state.fields.reminder_date ? new Date(this.state.fields.reminder_date) : this.state.fields.reminder_date}
                        onChange={date => this.changeInput('reminder_date', date.toString())}
                      />
                      <span className="form-err">{this.state.errors["reminder_date"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="net_plan">Net Plan</Label>
                      <Input type="text" id="net_plan" value={this.state.fields.net_plan} onChange={e => this.changeInput('net_plan', e.target.value)} placeholder="Enter Net Plan" />
                      <span className="form-err">{this.state.errors["net_plan"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="status">Status</Label>
                      <Input type="select" id="status" value={this.state.fields.status} onChange={e => this.changeInput('status', e.target.value)}>
                        <option value="">-- Select Status --</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </Input>
                      <span className="form-err">{this.state.errors["status"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="address">Address</Label>
                      <Input type="textarea" id="address" value={this.state.fields.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                      <span className="form-err">{this.state.errors["address"]}</span>
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
                      <Label htmlFor="search_customer_name">Customer Name</Label>
                      <Input type="text" id="search_customer_name" value={this.state.search.search_customer_name} onChange={e => this.changeInput('search_customer_name', e.target.value, 'search')} placeholder="Enter Customer Name" />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="search_mobile_number">Mobile No</Label>
                      <Input type="text" id="search_mobile_number" value={this.state.search.search_mobile_number} onChange={e => this.changeInput('search_mobile_number', e.target.value, 'search')} placeholder="Enter Mobile Number" />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="search_status">Status</Label>
                      <Input type="select" id="search_status" value={this.state.search.search_status} onChange={e => this.changeInput('search_status', e.target.value, 'search')}>
                        <option value="">-- Select Status --</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </Input>
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
                pageSize={this.state.records.length}
                showPagination={false}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
          {/* =================== Tabble And Search Form End =================== */}

          {/* ===================== Edit Modal Start =================== */}
          <Modal isOpen={this.state.show_modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Edit</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.updateRecord}>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="date">Date</Label><br />
                        <div className="custom-form-field">
                          <Input readOnly="readonly" type="text" id="date" value={this.state.edit_fields.date} />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="customer_name">Customer Name</Label>
                        <Input type="text" id="customer_name" value={this.state.edit_fields.customer_name} onChange={e => this.changeInput('customer_name', e.target.value)} placeholder="Enter Customer Name" />
                        <span className="form-err">{this.state.update_errors["customer_name"]}</span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="father_name">Father Name</Label>
                        <Input type="text" id="father_name" value={this.state.edit_fields.father_name} onChange={e => this.changeInput('father_name', e.target.value)} placeholder="Enter Father's Name" />
                        <span className="form-err">{this.state.update_errors["father_name"]}</span>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="mobile_number">Mobile No</Label>
                        <Input type="text" id="mobile_number" value={this.state.edit_fields.mobile_number} onChange={e => this.changeInput('mobile_number', e.target.value)} placeholder="Enter Mobile Number" />
                        <span className="form-err">{this.state.update_errors["mobile_number"]}</span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="status">Status</Label>
                        <Input type="select" id="status" value={this.state.edit_fields.status} onChange={e => this.changeInput('status', e.target.value)}>
                          <option value="">-- Select Status --</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </Input>
                        <span className="form-err">{this.state.update_errors["status"]}</span>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="net_plan">Net Plan</Label>
                        <Input type="text" id="net_plan" value={this.state.edit_fields.net_plan} onChange={e => this.changeInput('net_plan', e.target.value)} placeholder="Enter Net Plan" />
                        <span className="form-err">{this.state.update_errors["net_plan"]}</span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="reminder_date">Reminder Date</Label>
                        <DatePicker
                          id="reminder_date"
                          className='form-control'
                          placeholderText="Enter Reminder Date"
                          selected={this.state.edit_fields.reminder_date ? new Date(this.state.edit_fields.reminder_date) : this.state.edit_fields.reminder_date}
                          onChange={date => this.changeInput('reminder_date', date.toString())}
                        />
                        <span className="form-err">{this.state.update_errors["reminder_date"]}</span>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="address">Address</Label>
                        <Input type="textarea" id="address" value={this.state.edit_fields.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                        <span className="form-err">{this.state.update_errors["address"]}</span>
                      </FormGroup>
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