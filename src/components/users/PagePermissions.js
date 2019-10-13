import React from 'react';
import {
  Col,
  Input,
  Label,
  Row,
  FormGroup
} from 'reactstrap';
import Routes from "../../routes";
const config = require('../../config');
export default class PagePermissions extends React.Component {
  ignoredPaths = config.allowedPageUrls;
  constructor(props) {
    super(props);
    this.state = {
      "navItems": {}
    };
    this.handlePermissionChange = this.handlePermissionChange.bind(this);
  }

  handlePermissionChange(val) {
    let navItems = this.state.navItems;
    for (var key in navItems) {
      if (navItems.hasOwnProperty(key)) {
        if (val === navItems[key].path) {
          navItems[key].granted = !navItems[key].granted;
        }
      }
    }
    this.setState({ "navItems": navItems }, () => {
      this.props.permissionChangeCb(this.state.navItems);
    });
  }

  componentWillReceiveProps(props) {
    if (props.userPermissions) {
      this.setState({ "navItems": props.userPermissions });
    }
  }

  composeNavItems() {
    const navItems = {};
    if (Array.isArray(Routes)) {
      for (let navCounter = 0; navCounter < Routes.length; navCounter++) {
        const n = Routes[navCounter];
        if (n.name && n.path && !this.ignoredPaths[n.path]) {
          navItems[navCounter] = {
            "name": n.name,
            "path": n.path,
            "granted": false
          };
        }
      }
    }
    this.setState({ "navItems": navItems });
  }

  componentDidMount() {
    if (this.props.userPermissions) {
      this.setState({ "navItems": this.props.userPermissions });
    } else {
      this.composeNavItems();
    }
  }

  render() {
    const navItems = this.state.navItems;
    return <Row>
      <Col md="12">
        <Label>Page Permission</Label>
        <div style={{ 'borderBottom': '1px solid #CCC', 'marginBottom': '10px' }}></div>
      </Col>
      {
        Object.keys(navItems).map(index => {
          return <Col md="12" key={index}>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" value={navItems[index].path} checked={navItems[index].granted === true} onChange={e => this.handlePermissionChange(e.target.value)} /> {navItems[index].name}
              </Label>
            </FormGroup>
          </Col>
        })
      }
    </Row>;
  }
}
