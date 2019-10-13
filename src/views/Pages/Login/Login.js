import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { login } from '../../../actions/UserAction';
import { ToastContainer, ToastStore } from 'react-toasts';
import config from '../../../config.js';
import { getNavItems } from '../../../_nav';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 'fields': { 'email': '', 'password': '' }, 'errors': {} };
    this.login = this.login.bind(this);
  }
  componentWillMount() {
    const user = this.props.user;
    if (typeof user === 'object' && Object.keys(user).length) {
      this.props.history.replace('/dashboard');
    }
  }
  componentDidMount() {
    document.title = "Login";
  }
  showLoader(show = true) {
    const ldr = document.getElementById('ajax-loader-container');
    show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
  }
  changeInput(field, value) {
    const state = Object.assign({}, this.state);
    state['fields'][field] = value;
    this.setState(state);
  }
  login(e) {
    const self = this;
    e.preventDefault();
    self.validateForm(() => {
      self.showLoader();
      axios.post(config.apiUrl + 'users/login', self.state['fields'])
        .then(res => {
          self.showLoader(false);
          if (res.data.is_err) {
            ToastStore.error(res.data.message);
          } else {
            const userInfo = res.data.data;
            const isAdmin = userInfo.type==="admin";
            res.data.data.navItems = getNavItems(userInfo.pagePermissions, isAdmin);
            self.props.login(userInfo);
            self.props.history.push('/dashboard');
          }
        })
        .catch(err => {
          self.showLoader(false);
          ToastStore.error(err.message);
        });
    });
  }
  validateForm(cb) {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //ref: https://stackoverflow.com/questions/41296668/reactjs-form-input-validation

    //Email
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    }
    if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }

    //Password
    if (!fields["password"] || !fields['password'].trim().length) {
      formIsValid = false;
      errors["password"] = "Password can not be empty";
    }
    this.setState({ errors });
    if (formIsValid) {
      cb();
    }
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <ToastContainer store={ToastStore} />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.login}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" value={this.state.fields.email} onChange={e => this.changeInput('email', e.target.value)} placeholder="Email" autoComplete="username" />
                        <span className="form-err">{this.state.errors["email"]}</span>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" value={this.state.fields.password} onChange={e => this.changeInput('password', e.target.value)} placeholder="Password" autoComplete="current-password" />
                        <span className="form-err">{this.state.errors["password"]}</span>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {/* <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch(login(data))
  }
}
const mapStateToProps = (store) => {
  return {
    user: store.user
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
