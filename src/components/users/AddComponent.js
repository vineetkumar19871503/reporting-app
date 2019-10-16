import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, ToastStore } from 'react-toasts';
import PagePermissions from "./PagePermissions";
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
class AddUserComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'fields': {
        'fname': '',
        'lname': '',
        'address': '',
        'email': '',
        'password': '',
        'confirm_password': '',
        'pagePermissions': {},
        'status': 'true'
      },
      'errors': {}
    };
    this.saveUser = this.saveUser.bind(this);
    this.onPermissionChange = this.onPermissionChange.bind(this);
  }

  componentDidMount() {
    document.title = "Add New User";
  }

  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }

  onPermissionChange(pagePermissions) {
    const st = this.state;
    st.fields.pagePermissions = pagePermissions;
    this.setState({ "fields": st.fields });
  }

  validateForm(cb) {
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'fname', formIsValid);
    formIsValid = this._validateField('required', 'lname', formIsValid);
    formIsValid = this._validateField('required', 'email', formIsValid);
    formIsValid = this._validateField('email', 'email', formIsValid);
    formIsValid = this._validateField('required', 'password', formIsValid);
    formIsValid = this._validateField('required', 'confirm_password', formIsValid);
    formIsValid = this._validateField('matchPassword', 'confirm_password', formIsValid);
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
        const numVal = fields[name].toString();
        if (!(numVal.match(/^-?\d*(\.\d+)?$/))) {
          isFieldValid = false;
          this.errors[name] = "Please enter a valid number";
        }
        break;
      }
      case 'email': {
        let lastAtPos = fields[name].lastIndexOf('@');
        let lastDotPos = fields[name].lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields[name].indexOf('@@') === -1 && lastDotPos > 2 && (fields[name].length - lastDotPos) > 2)) {
          isFieldValid = false;
          this.errors[name] = "Email is not valid";
        }
        break;
      }
      case 'matchPassword': {
        if (fields[name] !== fields['password']) {
          isFieldValid = false;
          this.errors[name] = "Passwords do not match";
        }
        break;
      }
      default: return;
    }
    return isFieldValid;
  }
  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }
  saveUser(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      const fields = self.state.fields;
      fields.created_by = self.props.user._id;
      self.showLoader();
      axios.post(
        config.apiUrl + 'users/add',
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
            self.props.history.push('/users/list');
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
            <CardHeader>
              <strong>Add New User</strong>
            </CardHeader>
            <Form onSubmit={this.saveUser}>
              <CardBody>
                <ToastContainer store={ToastStore} />
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="fname">First Name</Label>
                      <Input type="text" id="fname" onChange={e => this.changeInput('fname', e.target.value)} placeholder="Enter First Name" />
                      <span className="form-err">{this.state.errors["fname"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="lname">Last Name</Label>
                      <Input type="text" id="lname" onChange={e => this.changeInput('lname', e.target.value)} placeholder="Enter Last Name" />
                      <span className="form-err">{this.state.errors["lname"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="email">Email</Label>
                      <Input type="text" autoComplete="off" id="email" onChange={e => this.changeInput('email', e.target.value)} placeholder="Enter Email" />
                      <span className="form-err">{this.state.errors["email"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="password">Password</Label>
                      <Input type="password" autoComplete="new-password" id="password" onChange={e => this.changeInput('password', e.target.value)} placeholder="Enter Password" />
                      <span className="form-err">{this.state.errors["password"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="confirm_password">Re-Enter Password</Label>
                      <Input type="password" autoComplete="new-password" id="confirm_password" onChange={e => this.changeInput('confirm_password', e.target.value)} placeholder="Re-Enter Password" />
                      <span className="form-err">{this.state.errors["confirm_password"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="address">Address</Label>
                      <Input type="textarea" id="address" onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                      <span className="form-err">{this.state.errors["address"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup row>
                  <Col md="2">
                    <Label>Status</Label>
                  </Col>
                  <Col md="10">
                    <FormGroup check inline className="radio">
                      <Input className="form-check-input" onChange={e => this.changeInput('status', e.target.value)} type="radio" id="status1" name="status" checked={this.state.fields.status === "true"} value="true" />
                      <Label check className="form-check-label" htmlFor="status1">Active</Label>
                    </FormGroup>
                    <FormGroup check inline className="radio">
                      <Input className="form-check-input" onChange={e => this.changeInput('status', e.target.value)} type="radio" id="status2" name="status" checked={this.state.fields.status === "false"} value="false" />
                      <Label check className="form-check-label" htmlFor="status2">Inactive</Label>
                    </FormGroup>
                    <span className="form-err">{this.state.errors["status"]}</span>
                  </Col>
                </FormGroup>
                <Row>
                  <Col md="12">
                    <PagePermissions permissionChangeCb={this.onPermissionChange} />
                  </Col>
                </Row>
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
export default connect(mapStateToProps)(AddUserComponent);