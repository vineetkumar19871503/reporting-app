import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

class DashboardComponent extends React.Component {
  componentDidMount() {
    document.title = "Dashboard";
  }
  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <strong>Dashboard</strong>
            </CardHeader>
            <CardBody>
              <h1>Welcome</h1>
            </CardBody>
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
export default connect(mapStateToProps)(DashboardComponent);