import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

class DashboardComponent extends React.Component {
  componentDidMount() {
    // console.log(this.props.user);
  }
  render() {
    return <div className="animated fadeIn">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <strong>Users</strong>
            </CardHeader>
            <CardBody>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>abc</td>
                  </tr>
                </tbody>
              </table>

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