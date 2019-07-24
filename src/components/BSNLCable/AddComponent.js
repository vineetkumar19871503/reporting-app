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
      'today_date': moment().format('DD/MM/YYYY'),
      'records': [],
      'fields': {
        'customer_name': '',
        'father_name': '',
        'mobile_number': '',
        'address': '',
        'net_plan': '',
        'reminder_date': '',
        'status': ''
      },
      'errors': {}
    };
    this.saveFormData = this.saveFormData.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  componentDidMount() {
    const self = this;
    document.title = "BSNL Cable - Add";
    self.getRecords();
  }
  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }
  resetForm() {
    this.setState({
      'fields': {
        'customer_name': '',
        'father_name': '',
        'mobile_number': '',
        'address': '',
        'net_plan': '',
        'reminder_date': '',
        'status': ''
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
    formIsValid = this._validateField('required', 'customer_name', formIsValid);
    formIsValid = this._validateField('required', 'father_name', formIsValid);
    formIsValid = this._validateField('required', 'mobile_number', formIsValid);
    formIsValid = this._validateField('required', 'address', formIsValid);
    formIsValid = this._validateField('required', 'net_plan', formIsValid);
    formIsValid = this._validateField('required', 'reminder_date', formIsValid);
    formIsValid = this._validateField('required', 'status', formIsValid);
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
      axios.post(
        config.apiUrl + 'bsnl-cable/add',
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
              <strong>BSNL Cable - Add</strong>
            </CardHeader>
            <Form onSubmit={this.saveFormData}>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="today_date">Date</Label><br />
                  <div className="custom-form-field">
                    <Input readOnly="readonly" type="text" id="today_date" value={this.state.today_date} />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input type="text" id="customer_name" value={this.state.fields.customer_name} onChange={e => this.changeInput('customer_name', e.target.value)} placeholder="Enter Customer Name" />
                  <span className="form-err">{this.state.errors["customer_name"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="father_name">Father Name</Label>
                  <Input type="text" id="father_name" value={this.state.fields.father_name} onChange={e => this.changeInput('father_name', e.target.value)} placeholder="Enter Father's Name" />
                  <span className="form-err">{this.state.errors["father_name"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="mobile_number">Mobile No</Label>
                  <Input type="text" id="mobile_number" value={this.state.fields.mobile_number} onChange={e => this.changeInput('mobile_number', e.target.value)} placeholder="Enter Mobile Number" />
                  <span className="form-err">{this.state.errors["mobile_number"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <Input type="textarea" id="address" value={this.state.fields.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                  <span className="form-err">{this.state.errors["address"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="net_plan">Net Plan</Label>
                  <Input type="text" id="net_plan" value={this.state.fields.net_plan} onChange={e => this.changeInput('net_plan', e.target.value)} placeholder="Enter Net Plan" />
                  <span className="form-err">{this.state.errors["net_plan"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="reminder_date">Reminder Date</Label>
                  <Input type="date" id="reminder_date" value={this.state.fields.reminder_date} onChange={e => this.changeInput('reminder_date', e.target.value)} placeholder="Enter Reminder Date" />
                  <span className="form-err">{this.state.errors["reminder_date"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="select" id="status" value={this.state.fields.status} onChange={e => this.changeInput('status', e.target.value)}>
                    <option value="">-- Please Select Status --</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Input>
                  <span className="form-err">{this.state.errors["status"]}</span>
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