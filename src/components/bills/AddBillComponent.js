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
const config = require('../../config.json');
class AddBillComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'fields': {
        'k_number': '',
        'consumer_name': '',
        'amount': '',
        'payment_mode': ''
      },
      'errors': {}
    };
    this.saveBill = this.saveBill.bind(this);
  }
  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }
  validateForm(cb) {
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'k_number', formIsValid);
    formIsValid = this._validateField('number', 'k_number', formIsValid);
    formIsValid = this._validateField('required', 'consumer_name', formIsValid);
    formIsValid = this._validateField('required', 'amount', formIsValid);
    formIsValid = this._validateField('number', 'amount', formIsValid);
    formIsValid = this._validateField('required', 'payment_mode', formIsValid);
    this.setState({ 'errors': this.errors });
    if (formIsValid) {
      cb();
    }
  }
  _validateField(type = 'required', name, formIsValid) {
    let fields = this.state.fields;
    let isFieldValid = formIsValid;
    if(this.errors[name]) {
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
        if(!(/^\d*$/.test(fields[name]))) {
          isFieldValid = false;
          this.errors[name] = "Please enter number";
        }
        break;
      }
      default: return;
    }
    return isFieldValid;
  }
  saveBill(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      const fields = self.state.fields;
      fields.added_by = self.props.user._id;
      axios.post(
        config.apiUrl + 'bills/add',
        fields,
        {
          'headers': {
            'Authorization': 'Bearer '+self.props.user.token
          }
        }
      )
        .then(res => {
          if (res.data.isErr) {
            ToastStore.error(res.data.message);
          } else {
            ToastStore.success(res.data.message);
          }
        })
        .catch(err => {
          ToastStore.error(err.message);
        });
    });
  }
  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <strong>Add New Bill</strong>
            </CardHeader>
            <Form onSubmit={this.saveBill}>
              <CardBody>
                <ToastContainer store={ToastStore} />
                <FormGroup>
                  <Label htmlFor="k_number">K Number</Label>
                  <Input type="text" id="knumber" onChange={e => this.changeInput('k_number', e.target.value)} placeholder="Enter K Number" />
                  <span className="form-err">{this.state.errors["k_number"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="consumer_name">Consumer Name</Label>
                  <Input type="text" id="consumer_name" onChange={e => this.changeInput('consumer_name', e.target.value)} placeholder="Enter Consumer Name" />
                  <span className="form-err">{this.state.errors["consumer_name"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="amount">Amount</Label>
                  <Input type="text" id="amount" onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                  <span className="form-err">{this.state.errors["amount"]}</span>
                </FormGroup>
                <FormGroup row>
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
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">Submit</Button>
                <Button type="reset" size="sm" color="danger">Reset</Button>
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
export default connect(mapStateToProps)(AddBillComponent);