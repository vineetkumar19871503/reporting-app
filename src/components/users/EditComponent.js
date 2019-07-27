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
class EditUserComponent extends React.Component {
  errors = {};
  constructor(props) {
    super(props);
    this.state = {
      'fields': {
        'name': '',
        'email': '',
        'password': '',
        'status': true
      },
      'errors': {}
    };
    this.saveUser = this.saveUser.bind(this);
  }
  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }
  componentDidMount() {
    if (this.props.user.type !== 'admin') {
      ToastStore.error("You are not authorized to perform this action");
      this.props.history.push('/dashboard');
    }
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
          'fields': {
            'name': user.name,
            'email': user.email,
            'status': user.status
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
    if (field === 'status') {
      value = value === 'true';
    }
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }
  validateForm(cb) {
    let formIsValid = true;
    this.errors = {};
    formIsValid = this._validateField('required', 'name', formIsValid);
    formIsValid = this._validateField('required', 'email', formIsValid);
    formIsValid = this._validateField('email', 'email', formIsValid);
    // formIsValid = this._validateField('required', 'password', formIsValid);
    // formIsValid = this._validateField('required', 'status', formIsValid);
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
      default: return;
    }
    return isFieldValid;
  }
  saveUser(e) {
    e.preventDefault();
    const self = this;
    self.validateForm(function () {
      const fields = self.state.fields;
      fields.uid = self.props.match.params.id;
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
  render() {
    const _f = this.state.fields;
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
                <FormGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" value={_f.name} onChange={e => this.changeInput('name', e.target.value)} placeholder="Enter Name" />
                  <span className="form-err">{this.state.errors["name"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input type="text" id="email" value={_f.email} onChange={e => this.changeInput('email', e.target.value)} placeholder="Enter Email" />
                  <span className="form-err">{this.state.errors["email"]}</span>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" onChange={e => this.changeInput('password', e.target.value)} placeholder="Enter Password" />
                  <span className="form-err">{this.state.errors["password"]}</span>
                </FormGroup>
                <FormGroup row>
                  <Col md="2">
                    <Label>Status</Label>
                  </Col>
                  <Col md="10">
                    <FormGroup check inline className="radio">
                      <Input className="form-check-input" onChange={e => this.changeInput('status', e.target.value)} type="radio" id="status1" name="status" checked={_f.status === true} value={true} />
                      <Label check className="form-check-label" htmlFor="status1">Active</Label>
                    </FormGroup>
                    <FormGroup check inline className="radio">
                      <Input className="form-check-input" onChange={e => this.changeInput('status', e.target.value)} type="radio" id="status2" name="status" checked={_f.status === false} value={false} />
                      <Label check className="form-check-label" htmlFor="status2">Inactive</Label>
                    </FormGroup>
                    <span className="form-err">{this.state.errors["status"]}</span>
                  </Col>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">Submit</Button>&nbsp;
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
export default connect(mapStateToProps)(EditUserComponent);