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
        'number_of_poles': '',
        'address': '',
        'an_jn_office': '',
        'staywire': ''
      },
      'errors': {}
    };
    this.saveFormData = this.saveFormData.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  componentDidMount() {
    const self = this;
    document.title = "Discom";
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
        'number_of_poles': '',
        'address': '',
        'an_jn_office': '',
        'staywire': ''
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
    formIsValid = this._validateField('required', 'number_of_poles', formIsValid);
    formIsValid = this._validateField('number', 'number_of_poles', formIsValid);
    formIsValid = this._validateField('required', 'address', formIsValid);
    formIsValid = this._validateField('required', 'an_jn_office', formIsValid);
    formIsValid = this._validateField('required', 'staywire', formIsValid);
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
              <strong>Discom - Add</strong>
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
                  <Label htmlFor="number_of_poles">No. Of Pole</Label>
                  <Input type="text" id="number_of_poles" value={this.state.fields.number_of_poles} onChange={e => this.changeInput('number_of_poles', e.target.value)} placeholder="Enter No. Of Poles" />
                  <span className="form-err">{this.state.errors["number_of_poles"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <Input type="textarea" id="address" value={this.state.fields.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                  <span className="form-err">{this.state.errors["address"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="net_plan">AN/JN Office</Label>
                  <Input type="text" id="an_jn_office" value={this.state.fields.an_jn_office} onChange={e => this.changeInput('an_jn_office', e.target.value)} placeholder="Enter An/JN Office" />
                  <span className="form-err">{this.state.errors["an_jn_office"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="staywire">Staywire</Label>
                  <Input type="date" id="staywire" value={this.state.fields.staywire} onChange={e => this.changeInput('staywire', e.target.value)} placeholder="Enter Staywire" />
                  <span className="form-err">{this.state.errors["staywire"]}</span>
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