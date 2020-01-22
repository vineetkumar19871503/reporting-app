import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer, ToastStore } from 'react-toasts';
import { logout } from '../../actions/UserAction';
import axios from 'axios';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import config from '../../config';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
// import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  intervalVal = 0;
  currentPath = null;
  constructor(props) {
    super(props);
    if (this.props.user.type === 'admin') {
      // navigation.items.push({
      //   name: 'Users',
      //   url: '/users',
      //   icon: 'icon-user',
      //   children: [
      //     {
      //       name: 'Add User',
      //       url: '/users/add',
      //       icon: 'icon-plus',
      //     },
      //     {
      //       name: 'Users List',
      //       url: '/users/list',
      //       icon: 'icon-list',
      //     }
      //   ]
      // });
    }
    this.state = { 'navItems': this.props.user.navItems };
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  async signOut(e) {
    if (e) { e.preventDefault(); }
    await this.props.logout();
    this.props.history.replace('/login');
  }

  componentWillMount() {
    if (this.props.user.type !== "admin") {
      this.intervalVal = setInterval(() => {
        this.syncPermissions();
      }, 3000);
    }

    this.unlisten = this.props.history.listen((location, action) => {
      this.currentPath = location.pathname;
      this.checkPagePermissionForUser();
    });

    this.currentPath = this.props.location.pathname;
    if (this.currentPath === '/') {
      this.props.history.push('/home');
    } else {
      const user = this.props.user;
      if (!user || (typeof user === 'object' && !Object.keys(user).length)) {
        this.props.history.push('/login');
      } else {
        const self = this;
        axios.get(config.apiUrl + 'users/checkSession', {
          headers: { 'Authorization': 'Bearer ' + user.token }
        })
          .then(res => {
          })
          .catch(err => {
            if (err.response && err.response.data) {
              ToastStore.error(err.response.data.message);
              if (err.response.data.message === 'User session expired') {
                self.signOut()
                self.props.history.push('/login');
              }
            }
          });
      }
    }
  }

  componentWillUnmount() {
    this.unlisten();
    clearInterval(this.intervalVal);
  }

  componentDidMount() {
    this.checkPagePermissionForUser();
  }

  syncPermissions() {
    const self = this;
    axios.post(
      config.apiUrl + 'users/syncPermissions',
      { "id": self.props.user._id },
      {
        'headers': {
          'Authorization': 'Bearer ' + self.props.user.token
        }
      }
    )
      .then(res => {
        if (res.data.is_err) {
          console.error(res.data.message);
        } else {
          if (res.data.synchronized) {
            alert("Your access permissions are changed by the Administrator! You are going to logout...");
            self.signOut();
          }
        }
      })
      .catch(err => {
        let errorMsg = err.message;
        if (err.response && err.response.data) {
          errorMsg = err.response.data.message;
        }
        console.error(errorMsg);
      });
  }

  checkPagePermissionForUser(url) {
    let doesUserHaveAccess = false;
    const userInfo = this.props.user;
    if (typeof userInfo == "object" && Object.keys(userInfo).length > 0) {
      this.currentPath = this.currentPath ? this.currentPath : this.props.location.pathname;
      const allowedPageUrls = config.allowedPageUrls;
      if (allowedPageUrls[this.currentPath] === true || userInfo.type === "admin") {
        doesUserHaveAccess = true;
      } else {
        const userPermissions = userInfo.pagePermissions;
        for (var key in userPermissions) {
          if (userPermissions.hasOwnProperty(key)) {
            if (userPermissions[key].path === this.currentPath && userPermissions[key].granted === true) {
              doesUserHaveAccess = true;
              break;
            }
          }
        }
        if (!doesUserHaveAccess) {
          ToastStore.error("You are not authorized to access this page");
          this.props.history.push('/dashboard');
        }
      }
    }
  }

  render() {
    return this.props.location.pathname === '/' ? null : (
      <div className="app">
        <ToastContainer store={ToastStore} />
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={this.state.navItems} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/login" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
