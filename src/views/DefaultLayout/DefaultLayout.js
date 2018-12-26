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
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
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
    this.state = { 'navItems': navigation };
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  signOut(e) {
    if(e) {
      e.preventDefault();
    }
    this.props.logout();
    this.props.history.replace('/login');
  }
  componentWillMount() {
    const user = this.props.user;
    if (!user || (typeof user === 'object' && !Object.keys(user).length)) {
      this.props.history.push('/login');
    } else {
      const self = this;
      axios.get(config.apiUrl + 'users/checkSession', {
        headers: { 'Authorization': 'Bearer ' + user }
      })
        .then(res => {
        })
        .catch(err => {
          if (err.response && err.response.data) {
            ToastStore.error(err.response.data.message);
            if(err.response.data.message==='User session expired'){
              self.signOut()
              self.props.history.push('/login');
            }
          }
        });
    }
  }
  render() {
    return (
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
              <AppSidebarNav navConfig={navigation} {...this.props} />
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
