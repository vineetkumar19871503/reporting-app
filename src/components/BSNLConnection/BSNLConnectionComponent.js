
import React, { Component } from 'react';
import Header from '../../views/HomeLayout/Header';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './styles.css';
import axios from 'axios';
import { ToastContainer, ToastStore } from 'react-toasts';
import config from '../../config.js';
import moment from 'moment';
import {
    Button,
    Container,
    CardBody,
    Card,
    Col,
    CardHeader,
    CardFooter,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';

export default class BSNLConnectionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'fields': {
                'date': moment().format('DD/MM/YYYY'),
                'customer_name': '',
                'father_name': '',
                'mobile_number': '',
                'address': '',
                'net_plan': '',
                'reminder_date': null,
                'status': ''
            },
            'errors': {}
        };

        this.saveFormData = this.saveFormData.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    componentDidMount() {
        document.title = "Request For New BSNL Connection";
    }

    resetForm() {
        this.setState({
            'errors': {},
            'fields': {
                'date': moment().format('DD/MM/YYYY'),
                'customer_name': '',
                'father_name': '',
                'mobile_number': '',
                'address': '',
                'net_plan': '',
                'reminder_date': null,
                'status': ''
            }
        });
    }

    showLoader(show = true) {
        const ldr = document.getElementById('ajax-loader-container');
        show ? ldr.classList.remove('disp-none') : ldr.classList.add('disp-none');
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
                if (!fields[name] || !fields[name].toString().trim().length) {
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

    changeInput(field, value) {
        const state = Object.assign({}, this.state);
        state['fields'][field] = value;
        this.setState(state);
    }

    saveFormData(e) {
        e.preventDefault();
        const self = this;
        self.validateForm(function () {
            self.showLoader();
            const fields = Object.assign({}, self.state.fields);
            fields.reminder_date = moment(new Date(fields.reminder_date)).format("MM/DD/YYYY");
            fields.date = moment().format('MM/DD/YYYY');
            fields.source = 'website';
            fields.created_by = self.props.user._id;
            axios.post(
                config.apiUrl + 'bsnlconnection/add',
                fields
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
                    let errorMsg = err.message;
                    if (err.response && err.response.data) {
                        errorMsg = err.response.data.message;
                    }
                    ToastStore.error(errorMsg);
                });
        });
    }

    render() {
        return (
            <div className="main">
                <Header activeClass='bsnl' />
                <div>
                    <Container>
                        <CardBody>
                            <Card>
                                <ToastContainer store={ToastStore} />
                                <Form onSubmit={this.saveFormData}>
                                    <CardBody>
                                        <CardHeader>
                                            REQUEST FOR NEW BSNL CONNECTION
                                        </CardHeader>
                                        <br />
                                        <Row>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="date">Date</Label><br />
                                                    <div className="custom-form-field">
                                                        <Input readOnly="readonly" type="text" id="date" value={this.state.fields.date} />
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="customer_name">Customer Name</Label>
                                                    <Input type="text" id="customer_name" value={this.state.fields.customer_name} onChange={e => this.changeInput('customer_name', e.target.value)} placeholder="Enter Customer Name" />
                                                    <span className="form-err">{this.state.errors["customer_name"]}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="father_name">Father Name</Label>
                                                    <Input type="text" id="father_name" value={this.state.fields.father_name} onChange={e => this.changeInput('father_name', e.target.value)} placeholder="Enter Father's Name" />
                                                    <span className="form-err">{this.state.errors["father_name"]}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="mobile_number">Mobile No</Label>
                                                    <Input type="text" id="mobile_number" value={this.state.fields.mobile_number} onChange={e => this.changeInput('mobile_number', e.target.value)} placeholder="Enter Mobile Number" />
                                                    <span className="form-err">{this.state.errors["mobile_number"]}</span>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="reminder_date">Reminder Date</Label>
                                                    <DatePicker
                                                        id="reminder_date"
                                                        className='form-control'
                                                        placeholderText="Enter Reminder Date"
                                                        selected={this.state.fields.reminder_date ? new Date(this.state.fields.reminder_date) : this.state.fields.reminder_date}
                                                        onChange={date => this.changeInput('reminder_date', date.toString())}
                                                    />
                                                    <span className="form-err">{this.state.errors["reminder_date"]}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="net_plan">Net Plan</Label>
                                                    <Input type="text" id="net_plan" value={this.state.fields.net_plan} onChange={e => this.changeInput('net_plan', e.target.value)} placeholder="Enter Net Plan" />
                                                    <span className="form-err">{this.state.errors["net_plan"]}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="status">Status</Label>
                                                    <Input type="select" id="status" value={this.state.fields.status} onChange={e => this.changeInput('status', e.target.value)}>
                                                        <option value="">-- Select Status --</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                    </Input>
                                                    <span className="form-err">{this.state.errors["status"]}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
                                                <FormGroup>
                                                    <Label htmlFor="address">Address</Label>
                                                    <Input type="textarea" id="address" value={this.state.fields.address} onChange={e => this.changeInput('address', e.target.value)} placeholder="Enter Address" />
                                                    <span className="form-err">{this.state.errors["address"]}</span>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <Button type="submit" size="sm" color="primary">Submit</Button>&nbsp;
                                        <Button type="button" onClick={this.resetForm} size="sm" color="danger">Reset</Button>
                                    </CardFooter>
                                </Form>
                            </Card>
                        </CardBody>
                    </Container>
                </div>
            </div>
        )
    }
}
