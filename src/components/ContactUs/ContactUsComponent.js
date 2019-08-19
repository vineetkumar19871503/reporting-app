
import React, { Component } from 'react';
import Header from '../../views/HomeLayout/Header';
import './styles.css';
import {
    Container,
    CardBody,
    Card,
    Form,
    Row,
    Col,
    Input,
    Label,
    FormGroup,
    Button
} from 'reactstrap';

export default class ContactUsComponent extends Component {
    componentDidMount() {
        document.title = "SENSA NETWORKING - CONTACT US";
    }

    render() {
        return (
            <div className="main">
                <Header activeClass = 'contactus'/>
                <div>
                    <Container>
                        <CardBody>
                            <div>
                                <h4>Come Visit us</h4>
                                <h5>Address:</h5>
                                <p>
                                    SENSA NETWORKING Yavukush Sen, 26A, Ariston Colonay, Main Pal Road, 12th Road. Opposite Barkatulla Khan Stadium, Jodhpur 342001.
                                </p>
                                <p>
                                    Email us with any questions or inquiries or you can call us on ‎+91 93525 43549. We would be happy to answer your question(s).
                                </p>
                            </div>
                            <Card>
                            <div style={{padding:10}}>
                                <Form>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label htmlFor="name">Name</Label><br />
                                                <div className="custom-form-field">
                                                    <Input type="text" id="name"/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label htmlFor="mobile">Mobile</Label><br />
                                                <div className="custom-form-field">
                                                    <Input type="text" id="mobile"/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label htmlFor="email">Email</Label><br />
                                                <div className="custom-form-field">
                                                    <Input type="text" id="email"/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="5">
                                            <FormGroup>
                                                <Label htmlFor="address">Address</Label><br />
                                                <div className="custom-form-field">
                                                    <Input type="textarea" id="address"/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="3">
                                            <Button type="submit" size="sm" color="primary">Send</Button>
                                        </Col>
                                        
                                    </Row>
                                </Form>
                            </div>
                            </Card>
                        </CardBody>
                    </Container>
                </div>
            </div>
        )
    }
}
