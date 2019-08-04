import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./views/DefaultLayout'),
  loading
});

// Pages

const Home = Loadable({
  loader: () => import('./components/Home/HomeComponent'),
  loading
});

const Services = Loadable({
  loader: () => import('./components/Services/ServicesComponent'),
  loading
});

const ContactUs = Loadable({
  loader: () => import('./components/ContactUs/ContactUsComponent'),
  loading
});

const BSNLConnection = Loadable({
  loader: () => import('./components/BSNLConnection/BSNLConnectionComponent'),
  loading
});

const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

const AjaxLoader = () => {
  return (
    <div id='ajax-loader-container' className='disp-none'>
      <div className='ajax-overlay'></div>
      <div className='ajax-loader'></div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div>
        <AjaxLoader />
        <BrowserRouter>
          <Switch>
            <Route exact path="/home" name="Home" component={Home} />
            <Route exact path="/services" name="Services" component={Services} />
            <Route exact path="/contact-us" name="Contact Us" component={ContactUs} />
            <Route exact path="/new-bsnl-connection" name="BSNL Connection" component={BSNLConnection} />
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
