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
import methods from '../../globals/methods';
class AddComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'is_update': false,
      'show_modal': false,
      'update_index': 0,
      'search': {
        'start_date': null,
        'end_date': null,
        'search_card_type': ''
      },
      'records': [],
      'printData': {},
      'edit_fields': {
        'date': moment().format('DD/MM/YYYY'),
        'name': '',
        'mobile': '',
        'card_type': 'Debit',
        'amount': '',
        'description': ''
      },
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'name': '',
        'mobile': '',
        'card_type': 'Debit',
        'amount': '',
        'description': ''
      },
      'errors': {},
      'update_errors': {},
      'cols': [
        {
          'Header': 'Name',
          'accessor': 'name'
        },
        {
          'Header': 'Mobile',
          'accessor': 'mobile'
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
          'Header': 'Actions',
          Cell: row => (
            <Row className="px-3">
              <Col md="5" className="p-0 mx-1"><Button block size="sm" color="primary" onClick={() => { this.printBill(row); }}>Print</Button></Col>
              <Col md="4" className="p-0 mx-1"><Button block size="sm" color="success" onClick={() => { this.setState({ 'update_index': row.index, 'edit_fields': row.original }, () => { this.toggleModal(); }); }}>Edit</Button></Col>
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
    this.printBill = this.printBill.bind(this);
  }

  toggleModal() {
    let show_modal = !this.state.show_modal;
    let is_update = show_modal === true;
    this.setState({ show_modal, is_update });
  }

  componentDidMount() {
    const self = this;
    document.title = "General Receipt - Add";
    self.getRecords();
    document.getElementById('dummyImg').addEventListener('load', function () {
      self.showLoader(false);
      methods.print("printContainer");
    });
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
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'name': '',
        'mobile': '',
        'card_type': 'Debit',
        'amount': '',
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
    axios.get(config.apiUrl + 'generalreceipt/list', p)
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
    formIsValid = this._validateField('required', 'name', formIsValid);
    formIsValid = this._validateField('required', 'mobile', formIsValid);
    formIsValid = this._validateField('required', 'card_type', formIsValid);
    formIsValid = this._validateField('required', 'amount', formIsValid);
    formIsValid = this._validateField('number', 'amount', formIsValid);
    formIsValid = this._validateField('required', 'description', formIsValid);
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
      const fields = self.state.fields;
      fields.date = moment().format('MM/DD/YYYY');
      fields.created_by = self.props.user._id;
      axios.post(
        config.apiUrl + 'generalreceipt/add',
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
        'search_card_type': ''
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
      // fields.date = moment().format('MM/DD/YYYY');
      fields.display_date = moment(fields.date).format("DD/MM/YYYY");
      axios.post(
        config.apiUrl + 'generalreceipt/edit',
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

  printBill(data) {
    this.setState({ printData: data.original });
    this.showLoader();
    this.loadDummyImg();
  }

  loadDummyImg() {
    document.getElementById('dummyImg').setAttribute('src', 'http://sensanetworking.in/assets/img/logo.jpg');
  }

  getTime(date) {
    date = new Date(date);
    var dt = date.getDate().toString();
    var mn = (date.getMonth() + 1).toString();
    dt = dt.length === 1 ? "0" + dt : dt;
    mn = mn.length === 1 ? "0" + mn : mn;
    return dt + '/' + mn + '/' + date.getFullYear() + ' ' + this.addZeroToTime(date.getHours()) + ':' + this.addZeroToTime(date.getMinutes()) + ':' + this.addZeroToTime(date.getSeconds())
  }

  addZeroToTime(t) {
    if (t < 10) {
      t = "0" + t;
    }
    return t;
  }

  getAmount(amt) {
    amt = Math.round(amt);
    return methods.moneyToWords(amt);
  }

  render() {
    const _p = this.state.printData;
    return <div className="animated fadeIn">
      <img alt="dummy-img" id="dummyImg" style={{ 'display': 'none' }} />
      <Row>
        <Col>
          <Card>
            <ToastContainer store={ToastStore} />
            <CardHeader>
              <strong>General Receipt - Add</strong>
            </CardHeader>
            <Form onSubmit={this.saveFormData}>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="date">Date</Label><br />
                      <div className="custom-form-field">
                        <Input readOnly="readonly" type="text" id="date" value={this.state.fields.date} />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="number_of_poles">Name</Label>
                      <Input type="text" id="name" value={this.state.fields.name} onChange={e => this.changeInput('name', e.target.value)} placeholder="Enter Name" />
                      <span className="form-err">{this.state.errors["name"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input type="text" id="mobile" value={this.state.fields.mobile} onChange={e => this.changeInput('mobile', e.target.value)} placeholder="Enter Mobile Number" />
                      <span className="form-err">{this.state.errors["mobile"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="6">
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
                      <Label htmlFor="amount">Amount</Label>
                      <Input type="text" id="amount" value={this.state.fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                      <span className="form-err">{this.state.errors["amount"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <Input type="textarea" id="description" value={this.state.fields.description} onChange={e => this.changeInput('description', e.target.value)} placeholder="Enter Description" />
                      <span className="form-err">{this.state.errors["description"]}</span>
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
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" value={this.state.edit_fields.name} onChange={e => this.changeInput('name', e.target.value)} placeholder="Enter Name" />
                        <span className="form-err">{this.state.update_errors["name"]}</span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input type="text" id="mobile" value={this.state.edit_fields.mobile} onChange={e => this.changeInput('mobile', e.target.value)} placeholder="Enter Mobile Number" />
                        <span className="form-err">{this.state.update_errors["mobile"]}</span>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="card_type">Debit/Credit</Label>
                        <Input type="select" id="card_type" value={this.state.edit_fields.card_type} onChange={e => this.changeInput('card_type', e.target.value)}>
                          <option value="Debit">Debit</option>
                          <option value="Credit">Credit</option>
                        </Input>
                        <span className="form-err">{this.state.update_errors["card_type"]}</span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="amount">Amount</Label>
                        <Input type="text" id="amount" value={this.state.edit_fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                        <span className="form-err">{this.state.update_errors["amount"]}</span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="description">Description</Label>
                        <Input type="textarea" id="description" value={this.state.edit_fields.description} onChange={e => this.changeInput('description', e.target.value)} placeholder="Enter Description" />
                        <span className="form-err">{this.state.update_errors["description"]}</span>
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
          {/* ===================== Edit Modal End =================== */}

        </Col>
      </Row>

      {
        Object.keys(_p).length > 0 ?
          <div id="printContainer" style={{ 'padding': '20px', 'position': 'fixed', 'top': '-10000px' }}>
          {/* <div id="printContainer" style={{ 'padding': '20px' }}> */}
            <div style={{ 'zoom': '65%', 'float': 'left' }}>
              <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ 'marginBottom': '15px' }}>
                <tbody>
                  <tr>
                    <td width="50%" style={styles.allBorders}>
                      <div style={{ 'padding': '15px' }}>
                        <div style={styles.print_img}></div>
                      </div>
                    </td>
                    <td style={styles.allBordersExceptLeft}>
                      <div style={{ 'padding': '15px', ...font }}>
                        <div style={{ 'fontSize': '22px', 'padding': 0, 'margin': '0 0 5px 0' }}>SENSA NETWORKING</div> <br />
                        Address: 26A, Aristson Colony, Main Pal Road, 12th Road <br />
                        Opp. Barkatulla Khan Stadium, Jodhpur <br />
                        <div style={{ 'marginTop': '8px' }}></div>
                        Mobile: 93525-43549 <br />
                        Email: sensanetworking@gmail.com <br />
                        Date: {this.getTime(_p.bill_submission_date)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ ...font, ...styles.allBordersExceptTop, 'padding': '25px', 'fontSize': '22px' }}>
                      <table border="0" width="100%">
                        <tbody>
                          <tr>
                            <td width="28%">Receipt Number:</td>
                            <td>{_p.receipt_number}</td>
                          </tr>
                          <tr>
                            <td width="28%">Name:</td>
                            <td>{_p.name}</td>
                          </tr>
                          <tr>
                            <td width="28%">Mobile No:</td>
                            <td>{_p.mobile}</td>
                          </tr>
                          <tr>
                            <td width="28%">Amount:</td>
                            <td>Rs. {Math.round(_p.amount)}/-</td>
                          </tr>
                          <tr>
                            <td width="28%">Description:</td>
                            <td>{_p.description}</td>
                          </tr>
                          <tr>
                            <td colSpan="2" style={{ "fontSize": "15px", "color":"#333333", "fontStyle": "italic" }}>
                              <div style={{"marginTop": "40px"}}></div>
                              Received Amount Rs. {Math.round(_p.amount)}/- ({this.getAmount(Math.round(_p.amount))}) <br />
                              (This is computer generated receipt and requires no signature.)
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          :
          null
      }
    </div>;
  }
}


const font = {
  'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
};
const styles = {
  'allBorders': {
    'border': '1px solid black',
    'paddingLeft': '5px',
    'paddingRight': '5px',
    ...font
  },
  'allBordersExceptLeft': {
    'borderTop': '1px solid black', 'borderRight': '1px solid black', 'borderBottom': '1px solid black',
    'paddingLeft': '5px',
    'paddingRight': '5px',
    ...font
  },
  'allBordersExceptTop': {
    'borderLeft': '1px solid black', 'borderRight': '1px solid black', 'borderBottom': '1px solid black',
    'paddingLeft': '5px',
    'paddingRight': '5px',
    ...font
  },
  'allBordersExceptTopAndLeft': {
    'borderRight': '1px solid black', 'borderBottom': '1px solid black',
    'paddingLeft': '5px',
    'paddingRight': '5px',
    ...font
  },
  'font18': {
    'fontSize': '14px',
    'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
  },
  'print_img': {
    'width': '298px',
    'height': '110px',
    'display': 'list-item',
    'margin': '0 auto',
    'listStyleImage': 'url(http://sensanetworking.in/assets/img/logo.jpg)',
    'listStylePosition': 'inside'
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(AddComponent);