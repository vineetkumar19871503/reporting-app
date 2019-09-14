import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
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
import ReactAutocomplete from 'react-autocomplete';
import config from '../../config.js';
import methods from '../../globals/methods';
class AddComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'printData': {},
      'shouldOpenAc': false,
      'consumers': [],
      'fields': {
        'k_number': '',
        'consumer_name': '',
        'amount': ''
        // 'payment_mode': ''
      },
      'errors': {}
    };
    this.saveBill = this.saveBill.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  componentDidMount() {
    const self = this;
    document.title = "Add New Bill";
    self.getConsumers();
    document.getElementById('dummyImg').addEventListener('load', function () {
      self.showLoader(false);
      methods.print("printContainer");
    });
  }
  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }
  resetForm() {
    this.setState({
      'shouldOpenAc': false,
      'fields': {
        'k_number': '',
        'consumer_name': '',
        'amount': ''
      }
    });
  }
  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }
  getConsumers(keyword) {
    const self = this;
    self.showLoader();
    axios.get(config.apiUrl + 'consumers/list', {
      headers: { 'Authorization': 'Bearer ' + self.props.user.token }
    })
      .then(res => {
        self.showLoader(false);
        const consumers = res.data.data.map(dt => {
          dt.value = dt.consumer_name;
          dt.name = dt.k_number;
          return dt;
        });
        self.setState({ 'consumers': consumers });
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
    formIsValid = this._validateField('required', 'k_number', formIsValid);
    formIsValid = this._validateField('required', 'consumer_name', formIsValid);
    formIsValid = this._validateField('required', 'amount', formIsValid);
    formIsValid = this._validateField('number', 'amount', formIsValid);
    if (!this.errors['k_number']) {
      const kNum = this.state.fields.k_number.trim();
      if (kNum.length !== 12) {
        formIsValid = false;
        this.errors.k_number = "The length of K Number should be 12";
      }
    }
    // formIsValid = this._validateField('required', 'payment_mode', formIsValid);
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
  onKnoChange(val) {
    const _s = Object.assign({}, this.state);
    let shouldOpenAc = false;
    if (val.length >= 8) {
      shouldOpenAc = true;
    }
    _s.fields.k_number = val;
    _s.shouldOpenAc = shouldOpenAc;
    _s.fields.consumer_name = '';
    this.setState(_s);
  }
  onKnoSelect(value, item) {
    const _s = Object.assign({}, this.state);
    _s.fields.k_number = value;
    _s.fields.consumer_name = item.consumer_name;
    _s.shouldOpenAc = false;
    this.setState(_s);
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
  loadDummyImg() {
    document.getElementById('dummyImg').setAttribute('src', 'http://sensanetworking.in/assets/img/logo.jpg');
  }
  printBill() {
    this.loadDummyImg();
  }
  getAmount(amt) {
    amt = Math.round(amt);
    return methods.moneyToWords(amt);
  }
  saveBill(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      self.showLoader();
      const fields = self.state.fields;
      fields.added_by = self.props.user._id;
      axios.post(
        config.apiUrl + 'bills/add',
        fields,
        {
          'headers': {
            'Authorization': 'Bearer ' + self.props.user.token
          }
        }
      )
        .then(res => {
          if (res.data.is_err) {
            self.showLoader(false);
            ToastStore.error(res.data.message);
          } else {
            ToastStore.success(res.data.message);
            self.resetForm();
            self.setState({ 'printData': res.data.data });
            self.printBill();
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
    const _p = this.state.printData;
    return <div className="animated fadeIn">
      <img alt="dummy-img" id="dummyImg" style={{ 'display': 'none' }} />
      <Row>
        <Col>
          <Card>
            <ToastContainer store={ToastStore} />
            <CardHeader>
              <strong>Add New Bill</strong>
            </CardHeader>
            <Form onSubmit={this.saveBill}>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="k_number">K Number</Label><br />
                  <div className="custom-form-field">
                    <ReactAutocomplete
                      items={this.state.consumers}
                      inputProps={{ placeholder: 'Enter K Number', maxLength: "12" }}
                      shouldItemRender={(item, value) => this.state.shouldOpenAc && item.k_number.toLowerCase().indexOf(value.toLowerCase()) > -1}
                      getItemValue={item => item.k_number}
                      renderItem={(item, highlighted) =>
                        <div
                          key={item._id}
                          className="autocomplete-item"
                          style={{ backgroundColor: highlighted ? '#eee' : '#fff' }}
                        >
                          {item.k_number}
                        </div>
                      }
                      value={this.state.fields.k_number}
                      onChange={e => this.onKnoChange(e.target.value)}
                      onSelect={(value, item) => this.onKnoSelect(value, item)}
                    />
                  </div>
                  <span className="form-err">{this.state.errors["k_number"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="consumer_name">Consumer Name</Label>
                  <Input type="text" id="consumer_name" value={this.state.fields.consumer_name} onChange={e => this.changeInput('consumer_name', e.target.value)} placeholder="Enter Consumer Name" />
                  <span className="form-err">{this.state.errors["consumer_name"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="amount">Amount</Label>
                  <Input type="text" id="amount" value={this.state.fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                  <span className="form-err">{this.state.errors["amount"]}</span>
                </FormGroup>
                {/* <FormGroup row>
                  <Col md="2">
                    <Label>Payment Mode</Label>
                  </Col>
                  <Col md="10">
                    <FormGroup check inline className="radio">
                      <Input className="form-check-input" onChange={e => this.changeInput('payment_mode', e.target.value)} type="radio" id="payment1" name="payment_mode" value="cash" />
                      <Label check className="form-check-label" htmlFor="payment1">Cash</Label>
                    </FormGroup>
                    <FormGroup check inline className="radio">
                      <Input className="form-check-input" onChange={e => this.changeInput('payment_mode', e.target.value)} type="radio" id="payment2" name="payment_mode" value="cheque" />
                      <Label check className="form-check-label" htmlFor="payment2">Cheque</Label>
                    </FormGroup>
                    <span className="form-err">{this.state.errors["payment_mode"]}</span>
                  </Col>
                </FormGroup> */}
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">Submit</Button>&nbsp;
                <Button type="button" onClick={this.resetForm} size="sm" color="danger">Reset</Button>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
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
                      <div style={{ 'width': '122px', 'wordWrap': 'break-word' }}>{(_p.consumer.k_number + '/' + _p.consumer.consumer_name).toUpperCase()}</div>
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
    </div>;
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
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
  'print_img': {
    'width': '298px',
    'height': '110px',
    'display': 'list-item',
    'margin': '0 auto',
    'listStyleImage': 'url(http://sensanetworking.in/assets/img/logo.jpg)',
    'listStylePosition': 'inside'
  }
}
export default connect(mapStateToProps)(AddComponent);