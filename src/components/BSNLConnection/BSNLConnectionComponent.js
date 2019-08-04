
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import HomePageLogo from '../../assets/img/home-page-logo.png';
import './styles.css';
import {
    Container,
    CardBody,
    Card
} from 'reactstrap';

export default class BSNLConnectionComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="main">
                <ul>
                    <li><Link to="/home"><img className="home-logo" src={HomePageLogo} /></Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/contact-us">Contact Us</Link></li>
                    <li><Link to="/new-bsnl-connection">BSNL Connection</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
                <div>
                    <Container>
                        <CardBody>
                            <Card style={{ 'textAlign': 'center', padding: '20' }}>
                                <h4>This page is under construction!</h4>
                            </Card>
                        </CardBody>
                    </Container>
                </div>
            </div>
        )
    }
}
