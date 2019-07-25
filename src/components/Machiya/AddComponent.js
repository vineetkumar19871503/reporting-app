import moment from 'moment';
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
import config from '../../config.js';
class AddComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'records': [],
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'amount': '',
        'card_type': 'Debit'
      },
      'errors': {}
    };
    this.saveFormData = this.saveFormData.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  componentDidMount() {
    const self = this;
    document.title = "Machiya - Add";
    self.getRecords();
  }
  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }
  resetForm(e) {
    e.preventDefault();
    this.setState({
      'fields': {
        'date': moment().format('DD/MM/YYYY'),
        'amount': '',
        'card_type': 'Debit'
      }
    });
  }
  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }
  getRecords(keyword) {
    const self = this;
    self.showLoader();
    axios.get(config.apiUrl + 'consumers/list', {
      headers: { 'Authorization': 'Bearer ' + self.props.user.token }
    })
      .then(res => {
        self.showLoader(false);
        const records = res.data.data.map(dt => {
          dt.value = dt.consumer_name;
          dt.name = dt.k_number;
          return dt;
        });
        self.setState({ 'records': records });
      })
      .catch(err => {
        self.showLoader(false);
        ToastStore.error(err.message);
      });
  }
  validateForm(cb) {
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'amount', formIsValid);
    formIsValid = this._validateField('required', 'card_type', formIsValid);
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
  
  saveFormData(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      self.showLoader();
      const fields = self.state.fields;
      fields.date = moment().format('MM/DD/YYYY');
      console.log(fields);
      return;
      axios.post(
        config.apiUrl + 'discom/add',
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
              <strong>Machiya - Add</strong>
            </CardHeader>
            <Form onSubmit={this.saveFormData}>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="date">Date</Label><br />
                  <div className="custom-form-field">
                    <Input readOnly="readonly" type="text" id="date" value={this.state.fields.date} />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="amount">Amount</Label>
                  <Input type="text" id="amount" value={this.state.fields.amount} onChange={e => this.changeInput('amount', e.target.value)} placeholder="Enter Amount" />
                  <span className="form-err">{this.state.errors["amount"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="card_type">Debit/Credit</Label>
                  <Input type="select" id="card_type" value={this.state.fields.card_type} onChange={e => this.changeInput('card_type', e.target.value)}>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                  </Input>
                  <span className="form-err">{this.state.errors["card_type"]}</span>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">Submit</Button>&nbsp;
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