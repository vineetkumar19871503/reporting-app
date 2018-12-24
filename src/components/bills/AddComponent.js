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
class AddComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
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
    document.title = "Add New Bill";
    this.getConsumers();
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
        ToastStore.error(err.message);
      });
  }
  validateForm(cb) {
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'k_number', formIsValid);
    formIsValid = this._validateField('required', 'consumer_name', formIsValid);
    formIsValid = this._validateField('required', 'amount', formIsValid);
    formIsValid = this._validateField('number', 'amount', formIsValid);
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
        if (!(/^\d*$/.test(fields[name]))) {
          isFieldValid = false;
          this.errors[name] = "Please enter number";
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
    if (val.length >= 1) {
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
          self.showLoader(false);
          if (res.data.is_err) {
            ToastStore.error(res.data.message);
          } else {
            ToastStore.success(res.data.message);
            self.resetForm();
          }
        })
        .catch(err => {
          self.showLoader(false);
          ToastStore.error(err.message);
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
              <strong>Add New Bill</strong>
            </CardHeader>
            <Form onSubmit={this.saveBill}>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="k_number">K Number</Label><br />
                  <div className="custom-form-field">
                    <ReactAutocomplete
                      items={this.state.consumers}
                      inputProps={{ placeholder: 'Enter K Number' }}
                      shouldItemRender={(item, value) => item.k_number.trim().length > 0}
                      getItemValue={item => item.k_number}
                      open={this.state.shouldOpenAc}
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
                  <span className="form-err">{this.state.errors["consumer_name"]}</span>
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
                <Button type="submit" size="sm" color="primary">Submit</Button>
                <Button type="button" onClick={this.resetForm} size="sm" color="danger">Reset</Button>
              </CardFooter>
            </Form>
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
export default connect(mapStateToProps)(AddComponent);