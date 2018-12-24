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
    this.state = {
      'search': {
        'k_number': '',
        'startDate': new Date(),
        'endDate': new Date()
      },
      'bills': [],
      'printData': {},
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
            <div className='text-center'><button onClick={() => this.printBill(row)}>Print</button></div>
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
    this.setState({ printData: data.original }, () => {
      methods.print("printContainer");
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
    if (Object.keys(_s).length) {
      this.getBills(_s);
    }
  }
  componentDidMount() {
    document.title = "Bills";
    this.getBills();
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
                        selected={this.state.search.endDate}
                        onChange={date => this.changeInput('endDate', date)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <br />
                    <div style={{paddingTop:'6px'}}>
                    <Button color="primary" className="px-4">Search</Button>
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
                  <div id="printContainer" style={{ 'padding': '20px', 'display': 'none' }}>
                    <div style={{ 'marginTop': '40px', 'width': '100%', 'textAlign': 'center', 'borderBottom': '1px solid black', 'marginBottom': '15px' }}>
                      <h2>
                        Government of Rajasthan
                        <br />
                        District e-Governance Society (Jodhpur)
                      </h2>
                    </div>
                    <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ 'marginBottom': '15px' }}>
                      <tbody>
                        <tr>
                          <td width="50%" style={styles.allBorders}>
                            <div style={{ 'padding': '15px' }}>Image will be shown here</div>
                          </td>
                          <td style={styles.allBordersExceptLeft}>
                            <div style={{ 'padding': '15px' }}>
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
                          <td width="50%" style={{ 'paddingLeft': '30px' }}><strong>Receipt No:</strong> {_p.receipt_number}</td>
                          <td style={{ 'paddingLeft': '30px' }}>
                            <strong>Receipt Date/Time:</strong> {this.getTime(_p.bill_submission_date)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                      <thead>
                        <tr>
                          <th align="center" style={styles.allBorders}>Sr No.</th>
                          <th align="center" style={styles.allBordersExceptLeft}>Department/Service</th>
                          <th align="center" style={styles.allBordersExceptLeft}>Consumer Info</th>
                          <th align="center" style={styles.allBordersExceptLeft}>Trans ID</th>
                          <th align="center" style={styles.allBordersExceptLeft}>Mode Ref No</th>
                          <th align="center" style={styles.allBordersExceptLeft}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td align="center" style={styles.allBordersExceptTop}>1</td>
                          <td align="center" style={styles.allBordersExceptTopAndLeft}>DISCOM/K No</td>
                          <td align="center" style={styles.allBordersExceptTopAndLeft}>{_p.consumer.k_number + '/' + _p.consumer.consumer_name}</td>
                          <td align="center" style={styles.allBordersExceptTopAndLeft}>{_p.trans_id}</td>
                          <td align="center" style={styles.allBordersExceptTopAndLeft}>{_p.payment_mode.toUpperCase()}</td>
                          <td align="right" style={styles.allBordersExceptTopAndLeft}>
                            <div style={{ 'paddingRight': '15px' }}>{_p.amount.toFixed(4)}</div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="5" style={styles.allBordersExceptTop}><strong style={{ 'paddingLeft': '15px' }}>Grand Total</strong></td>
                          <td align="right" style={styles.allBordersExceptTopAndLeft}><strong style={{ 'paddingRight': '15px' }}>{_p.amount.toFixed(4)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                    <div style={{ 'marginTop': '8px', 'fontSize': '15px', 'fontStyle': 'italic' }}>
                      Disclaimer: Payment through Cheque or DD are subject to realization.
                    </div>
                    <div style={{ 'marginTop': '30px' }}>
                      Received Amount Rs. {_p.amount.toFixed(4)} ( Rupees {this.getAmount(_p.amount)} Only )
                    </div>
                    <div style={{ 'textAlign': 'center', 'fontStyle': 'italic', 'fontSize': '15px', 'marginTop': '40px' }}>
                      (This is a computer generated receipt and requires no signature)
                    </div>
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
const styles = {
  'allBorders': {
    'border': '1px solid black'
  },
  'allBordersExceptLeft': {
    'borderTop': '1px solid black', 'borderRight': '1px solid black', 'borderBottom': '1px solid black'
  },
  'allBordersExceptTop': {
    'borderLeft': '1px solid black', 'borderRight': '1px solid black', 'borderBottom': '1px solid black'
  },
  'allBordersExceptTopAndLeft': {
    'borderRight': '1px solid black', 'borderBottom': '1px solid black'
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(ListComponent);