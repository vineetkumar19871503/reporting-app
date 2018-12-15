import React from 'react';
import DefaultLayout from './views/DefaultLayout';

const DashboardComponent = React.lazy(() => import('./components/dashboard/DashboardComponent'));
const AddBillComponent = React.lazy(() => import('./components/bills/AddComponent'));
const BillsListingComponent = React.lazy(() => import('./components/bills/ListComponent'));
const UsersListingComponent = React.lazy(() => import('./components/users/ListComponent'));
const AddUserComponent = React.lazy(() => import('./components/users/AddComponent'));
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
  { path: '/bills/add', name: 'Add Bill', component: AddBillComponent },
  { path: '/bills/list', name: 'Bills List', component: BillsListingComponent },
  { path: '/users/list', name: 'Users List', component: UsersListingComponent },
  { path: '/users/add', name: 'Add User', component: AddUserComponent },
];

export default routes;
