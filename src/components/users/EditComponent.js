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
class EditUserComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'userInfo': {},
      'change_password_checked': false,
      'fields': {
        'fname': '',
        'lname': '',
        'address': '',
        'email': '',
        'status': 'true',
        'password': '',
        'confirm_password': '',
        'pagePermissions': {}
      },
      'errors': {}
    };
    this.saveUser = this.saveUser.bind(this);
    this.onPermissionChange = this.onPermissionChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onChangePasswordChecked = this.onChangePasswordChecked.bind(this);
  }

  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }

  componentDidMount() {
    document.title = "Edit User";
    const self = this;
    self.showLoader();
    axios.get(
      config.apiUrl + 'users/getUserById?id=' + this.props.match.params.id,
      {
        'headers': {
          'Authorization': 'Bearer ' + self.props.user.token
        }
      }
    )
      .then(res => {
        self.showLoader(false);
        const user = res.data.data[0];
        self.setState({
          'userInfo': user,
          'prevUserInfo': JSON.parse(JSON.stringify(user)),
          'fields': {
            'fname': user.fname,
            'lname': user.lname,
            'address': user.address,
            'email': user.email,
            'status': String(user.status),
            'userPermissions': user.pagePermissions
          }
        });
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

  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }

  resetForm(e) {
    let state = this.state;
    state.fields = {
      'fname': '',
      'lname': '',
      'address': '',
      'email': '',
      'status': 'true',
      'password': '',
      'confirm_password': '',
      'pagePermissions': state.fields.userPermissions
    };
    state.userInfo.pagePermissions = null;
    this.setState(state, () => {
      this.onPermissionChange(this.state.userInfo.pagePermissions);
    });
  }

  validateForm(cb) {
    const isChangePasswordChecked = this.state.change_password_checked;
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'fname', formIsValid);
    formIsValid = this._validateField('required', 'lname', formIsValid);
    formIsValid = this._validateField('required', 'email', formIsValid);
    formIsValid = this._validateField('email', 'email', formIsValid);
    // formIsValid = this._validateField('required', 'password', formIsValid);
    // formIsValid = this._validateField('required', 're_password', formIsValid);
    // formIsValid = this._validateField('matchPassword', 're_password', formIsValid);
    formIsValid = this._validateField('required', 'status', formIsValid);
    if (isChangePasswordChecked) {
      formIsValid = this._validateField('required', 'password', formIsValid);
      formIsValid = this._validateField('required', 'confirm_password', formIsValid);
      formIsValid = this._validateField('matchPassword', 'confirm_password', formIsValid);
    }
    this.setState({ 'errors': this.errors });
    if (formIsValid) {
      cb();
    }
  }

  onChangePasswordChecked(checked) {
    this.setState({ "change_password_checked": !this.state.change_password_checked }, () => {
      const st = this.state;
      if (!st.change_password_checked) {
        st.fields.password = '';
        st.fields.confirm_password = '';
        delete st.errors.confirm_password;
      }
    });
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

  saveUser(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      const st = JSON.parse(JSON.stringify(self.state));
      const fields = st.fields;
      fields.uid = self.props.match.params.id;
      if (JSON.stringify(fields.userPermissions) !== JSON.stringify(self.state.prevUserInfo.pagePermissions)) {
        fields.permissionsSynchronized = false;
      }
      if (!st.change_password_checked) {
        delete fields.password;
      }
      delete fields.confirm_password;
      delete fields.change_password_checked;
      self.showLoader();
      axios.post(
        config.apiUrl + 'users/edit',
        fields,
        {
          'headers': {
            'Authorization': 'Bearer ' + self.props.user.token
          }
        }
      )
        .then(res => {
          if (res.data.is_err) {
            ToastStore.error(res.data.message);
          } else {
            ToastStore.success(res.data.message);
            self.props.history.push('/users/list');
          }
        })
        .catch(err => {
          let errorMsg = err.message;
          if (err.response && err.response.data) {
            errorMsg = err.response.data.message;
          }
          ToastStore.error(errorMsg);
        });
    });
  }

  onPermissionChange(pagePermissions) {
    const st = this.state;
    st.fields.pagePermissions = pagePermissions;
    this.setState({ "fields": st.fields });
  }

  render() {
    const _f = this.state.fields;
    const isAdmin = this.props.user.type === "admin";
    return <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <strong>Edit User</strong>
            </CardHeader>
            <Form onSubmit={this.saveUser}>
              <CardBody>
                <ToastContainer store={ToastStore} />
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="fname">First Name</Label>
                      <Input type="text" id="fname" value={_f.fname} onChange={e => this.changeInput('fname', e.target.value)} placeholder="Enter First Name" />
                      <span className="form-err">{this.state.errors["fname"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="lname">Last Name</Label>
                      <Input type="text" id="lname" value={_f.lname} onChange={e => this.changeInput('lname', e.target.value)} placeholder="Enter Last Name" />
                      <span className="form-err">{this.state.errors["lname"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="email">Email</Label>
                      <Input type="text" autoComplete="off" id="email" value={_f.email} onChange={e => this.changeInput('email', e.target.value)} placeholder="Enter Email" />
                      <span className="form-err">{this.state.errors["email"]}</span>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="address">Address</Label>
                      <Input type="textarea" id="address" value={_f.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                      <span className="form-err">{this.state.errors["address"]}</span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" value={this.state.change_password_checked} checked={this.state.change_password_checked === true} onChange={e => this.onChangePasswordChecked(e.target.value)} /> Change Password?
                    </Label>
                    </FormGroup>
                  </Col>
                </Row>
                {
                  this.state.change_password_checked ?
                    <div>
                      <br />
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" autoComplete="new-password" id="password" onChange={e => this.changeInput('password', e.target.value)} placeholder="Enter Password" />
                            <span className="form-err">{this.state.errors["password"]}</span>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label htmlFor="confirm_password">Re-Enter Password</Label>
                            <Input type="password" autoComplete="new-password" id="confirm_password" onChange={e => this.changeInput('confirm_password', e.target.value)} placeholder="Re-Enter Password" />
                            <span className="form-err">{this.state.errors["confirm_password"]}</span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    :
                    null
                }
                <br />
                {
                  this.state.userInfo._id && isAdmin && this.props.match.params.id !== this.props.user._id ?
                    <div>
                      <FormGroup row>
                        <Col md="2">
                          <Label>Status</Label>
                        </Col>
                        <Col md="10">
                          <FormGroup check inline className="radio">
                            <Input className="form-check-input" onChange={e => this.changeInput('status', e.target.value)} type="radio" id="status1" name="status" checked={_f.status === "true"} value="true" />
                            <Label check className="form-check-label" htmlFor="status1">Active</Label>
                          </FormGroup>
                          <FormGroup check inline className="radio">
                            <Input className="form-check-input" onChange={e => this.changeInput('status', e.target.value)} type="radio" id="status2" name="status" checked={_f.status === "false"} value="false" />
                            <Label check className="form-check-label" htmlFor="status2">Inactive</Label>
                          </FormGroup>
                          <span className="form-err">{this.state.errors["status"]}</span>
                        </Col>
                      </FormGroup>
                      <Row>
                        <Col md="12">
                          {
                            this.state.userInfo.pagePermissions ?
                              <PagePermissions permissionChangeCb={this.onPermissionChange} userPermissions={this.state.userInfo.pagePermissions} />
                              :
                              <div>
                                <PagePermissions permissionChangeCb={this.onPermissionChange} />
                              </div>
                          }

                        </Col>
                      </Row>
                    </div>
                    : null
                }
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">Submit</Button>&nbsp;
                <Button type="reset" size="sm" color="danger" onClick={this.resetForm}>Reset</Button>
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
export default connect(mapStateToProps)(EditUserComponent);