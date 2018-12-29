import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, ToastStore } from 'react-toasts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";
import config from '../../config.js';
import methods from '../../globals/methods';
class ListComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.searchBill = this.searchBill.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.state = {
      'search': {
        'k_number': '',
        'startDate': new Date(),
        'endDate': new Date()
      },
      'bills': [],
      'printData': {},
      'reportData': {},
      'cols': [
        {
          'Header': 'K Number',
          'accessor': 'consumer.k_number'
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
          'accessor': 'consumer.consumer_name'
        },
        {
          'Header': 'Receipt Number',
          'accessor': 'receipt_number'
        },
        {
          'Header': 'Actions',
          Cell: row => (
            <Row>
              <Col md="6"><Button block size="sm" color="primary" onClick={() => this.printBill(row)}>Print</Button></Col>
              <Col md="6"><Button block size="sm" color="success" onClick={() => this.printReport(row)}>Report</Button></Col>
            </Row>
          )
        }
      ]
    };
  }
  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['search'][field] = value;
    this.setState(state);
  }
  getTime(date) {
    date = new Date(date);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + this.addZeroToTime(date.getHours()) + ':' + this.addZeroToTime(date.getMinutes()) + ':' + this.addZeroToTime(date.getSeconds())
  }
  addZeroToTime(t) {
    if (t < 10) {
      t = "0" + t;
    }
    return t;
  }
  printBill(data) {
    const self = this;
    self.setState({ printData: data.original });
    self.showLoader();
    self.loadDummyImg();
  }
  printReport(data) {
    this.setState({ reportData: data.original }, () => {
      methods.print("reportContainer");
    });
  }
  searchBill(e) {
    e.preventDefault();
    const _s = Object.assign({}, this.state.search);
    if (!_s.k_number.trim()) {
      delete _s.k_number;
    }
    if (!_s.startDate) {
      delete _s.startDate;
    }
    if (!_s.endDate) {
      delete _s.endDate;
    }
    this.getBills(_s);
  }
  clearSearch() {
    const self = this;
    self.setState({
      'search': {
        'k_number': '',
        'startDate': '',
        'endDate': ''
      }
    }, () => self.getBills());
  }
  componentDidMount() {
    const self = this;
    document.title = "Bills";
    this.getBills();
    document.getElementById('dummyImg').addEventListener('load', function () {
      self.showLoader(false);
      methods.print("printContainer");
    });
  }
  loadDummyImg() {
    document.getElementById('dummyImg').setAttribute('src', 'https://raw.githubusercontent.com/vineetkumar19871503/reporting-app/master/public/assets/img/logo.jpg');
  }
  getAmount(amt) {
    amt = Math.round(amt);
    return methods.moneyToWords(amt);
  }
  getBills(params) {
    const self = this;
    const p = {
      headers: { 'Authorization': 'Bearer ' + self.props.user.token }
    };
    if (params) {
      p.params = params;
    }
    self.showLoader();
    axios.get(config.apiUrl + 'bills/list', p)
      .then(res => {
        self.showLoader(false);
        self.setState({ 'bills': res.data.data });
      })
      .catch(err => {
        self.showLoader(false);
        ToastStore.error(err.message);
      });
  }
  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }
  render() {
    const _p = this.state.printData;
    const _r = this.state.reportData;
    return <div className="animated fadeIn">
      <img id="dummyImg" style={{ 'display': 'none' }} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <strong>Bills</strong>
              <Button size="sm" className="float-right" color="success" onClick={() => this.props.history.push('/bills/add')}>Add Bill</Button>
            </CardHeader>
            <CardBody>
              <ToastContainer store={ToastStore} />
              <Form onSubmit={this.searchBill}>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="k_number">K Number</Label>
                      <Input type="text" id="k_number" value={this.state.search.k_number} onChange={e => this.changeInput('k_number', e.target.value)} placeholder="Enter K Number" />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="startDate">Date From</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="Date From"
                        selected={this.state.search.startDate}
                        onChange={date => this.changeInput('startDate', date)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label htmlFor="endDate">Date To</Label><br />
                      <DatePicker
                        className='form-control'
                        placeholderText="Date To"
                        selected={this.state.search.endDate}
                        onChange={date => this.changeInput('endDate', date)}
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
                data={this.state.bills}
                columns={this.state.cols}
                defaultPageSize={10}
                className="-striped -highlight"
              />
              {
                Object.keys(_p).length > 0 ?
                  <div id="printContainer" style={{ 'padding': '20px', 'position': 'fixed', 'top': '-10000px' }}>
                    <div style={{ 'zoom': '55%', 'float': 'left' }}>
                      <div style={{ 'marginTop': '40px', 'width': '100%', 'textAlign': 'center', 'borderBottom': '1px solid black', 'marginBottom': '15px' }}>
                        <h3 style={font}>
                          Government of Rajasthan
                          <br />
                          District e-Governance Society (Jodhpur)
                        </h3>
                      </div>
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
                                Code: K21005887 [ AKSH.AKSH.2366.JOD ] <br />
                                Kiosk: AKSH OPTIFIBRE LTD <br />
                                LSP: AKSH OPTIFIBRE <br />
                                Phone: 9928268192 <br />
                                Email: SENSANETWORKING@GMAIL.COM
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ 'marginBottom': '15px' }}>
                        <tbody>
                          <tr>
                            <td width="50%" style={{ 'paddingLeft': '30px', ...font }}><strong style={font}>Receipt No:</strong> {_p.receipt_number}</td>
                            <td style={{ 'paddingLeft': '30px', ...font }}>
                              <strong style={font}>Receipt Date/Time:</strong> {this.getTime(_p.bill_submission_date)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <thead>
                          <tr>
                            <th align="left" style={styles.allBorders}>Sr <br /> No.</th>
                            <th align="left" style={styles.allBordersExceptLeft}>Department/Service</th>
                            <th align="left" style={styles.allBordersExceptLeft}>Consumer Info</th>
                            <th align="left" style={styles.allBordersExceptLeft}>Trans ID</th>
                            <th align="left" style={styles.allBordersExceptLeft}>Mode Ref <br /> No</th>
                            <th align="right" style={styles.allBordersExceptLeft}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={styles.allBordersExceptTop}>1</td>
                            <td style={styles.allBordersExceptTopAndLeft}>DISCOM/K No</td>
                            <td style={styles.allBordersExceptTopAndLeft}>
                              <div style={{ 'width': '114px', 'wordWrap': 'break-word' }}>{(_p.consumer.k_number + '/' + _p.consumer.consumer_name).toUpperCase()}</div>
                            </td>
                            <td style={styles.allBordersExceptTopAndLeft}>{_p.trans_id}</td>
                            <td style={styles.allBordersExceptTopAndLeft}>
                              <div style={{ 'width': '75px', 'wordWrap': 'break-word' }}>{(_p.payment_mode + '/' + _p.payment_mode).toUpperCase()}</div>
                            </td>
                            <td align="right" style={styles.allBordersExceptTopAndLeft}>
                              <div style={{ 'paddingRight': '15px', ...font }}>{_p.amount.toFixed(4)}</div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="5" style={styles.allBordersExceptTop}><strong style={{ 'paddingLeft': '15px', ...font }}>Grand Total</strong></td>
                            <td align="right" style={styles.allBordersExceptTopAndLeft}><strong style={{ 'paddingRight': '15px', ...font }}>{_p.amount.toFixed(4)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ 'marginTop': '8px', 'fontSize': '15px', 'fontStyle': 'italic', ...font }}>
                        Disclaimer: Payment through Cheque or DD are subject to realization.
                      </div>
                      <div style={{ 'marginTop': '30px', ...font }}>
                        Received Amount Rs. {_p.amount.toFixed(4)} ( Rupees {this.getAmount(_p.amount)} Only )
                      </div>
                      <div style={{ 'textAlign': 'center', 'fontStyle': 'italic', 'fontSize': '15px', 'marginTop': '40px', ...font }}>
                        (This is a computer generated receipt and requires no signature)
                      </div>
                    </div>
                  </div>
                  :
                  null
              }
              {
                Object.keys(_r).length > 0 ?
                  <div id="reportContainer" style={{ 'padding': '50px', 'display': 'none' }}>
                    <br /><br /><br />
                    <span style={styles.font18}>Receipt No: {_r.receipt_number}</span><span style={{ 'marginLeft': '150px', ...styles.font18 }}>Date: {this.getTime(_r.bill_submission_date)}</span><br />
                    ----------------------------------------------------------------------------------------------------------- <br />
                    <table border="0">
                      <tbody>
                        <tr>
                          <td style={styles.font18}>DeptName/ServiceName/ConsumerKey/ConsumerName</td>
                          <td style={{ 'paddingLeft': '15px', 'paddingRight': '15px', ...styles.font18 }}>Transaction No</td>
                          <td style={{ 'paddingLeft': '15px', 'paddingRight': '15px', ...styles.font18 }}>Amount (Rs.)</td>
                        </tr>
                        <tr>
                          <td style={styles.font18}>DISCOM/K No/{_r.consumer.k_number}/{_r.consumer.consumer_name}</td>
                          <td align="center" style={{ 'paddingLeft': '15px', 'paddingRight': '15px', ...styles.font18 }}>{_r.trans_id}</td>
                          <td align="right" style={{ 'paddingLeft': '15px', 'paddingRight': '15px', ...styles.font18 }}>{_r.amount.toFixed(1)}</td>
                        </tr>
                      </tbody>
                    </table>
                    ----------------------------------------------------------------------------------------------------------- <br />
                    <span style={styles.font18}>
                      Received Rs. {_r.amount.toFixed(4)}/- (Rupees {this.getAmount(_r.amount)} Only) For Services Listed Above. <br />
                      Pay Mode/Payment Ref No: {(_r.payment_mode + '/' + _r.payment_mode).toUpperCase()} <br />
                      Signature <br />
                      AKSH OPTIFIBRE LTD (Kiosk Code-Sso Id: K21005887-AKSH.AKSH.2366.JOD) <br />
                      Contact Number: 9928268192
                    </span>
                    <br />
                    ----------------------------------------------------------------------------------------------------------- <br />
                    ----------------------------------------------------------------------------------------------------------- <br />
                  </div>
                  :
                  null
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
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
    'listStyleImage': 'url(https://raw.githubusercontent.com/vineetkumar19871503/reporting-app/master/public/assets/img/logo.jpg)',
    'listStylePosition': 'inside'
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(ListComponent);