import React from 'react';
import DefaultLayout from './views/DefaultLayout';

const DashboardComponent = React.lazy(() => import('./components/dashboard/DashboardComponent'));
const AddBillComponent = React.lazy(() => import('./components/bills/AddBillComponent'));
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
  { path: '/bills/add', name: 'Add Bill', component: AddBillComponent },
];

export default routes;
