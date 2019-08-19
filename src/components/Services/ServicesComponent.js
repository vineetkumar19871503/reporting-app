
import React, { Component } from 'react';
import Header from '../../views/HomeLayout/Header';
import './styles.css';
import {
    Container,
    CardBody,
    Card
} from 'reactstrap';

export default class ServicesComponent extends Component {
    componentDidMount() {
        document.title = "SENSA NETWORKING - SERVICES";
    }
    
    render() {
        return (
            <div className="main">
                <Header activeClass='service'/>
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
