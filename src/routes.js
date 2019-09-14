import React from 'react';
import DefaultLayout from './views/DefaultLayout';

const DashboardComponent = React.lazy(() => import('./components/dashboard/DashboardComponent'));
const AddBillComponent = React.lazy(() => import('./components/bills/AddComponent'));
const BillsListingComponent = React.lazy(() => import('./components/bills/ListComponent'));
const UsersListingComponent = React.lazy(() => import('./components/users/ListComponent'));
const AddUserComponent = React.lazy(() => import('./components/users/AddComponent'));
const EditUserComponent = React.lazy(() => import('./components/users/EditComponent'));

const AddBSNLCableComponent = React.lazy(() => import('./components/BSNLCable/AddComponent'));
const AddDiscomPoleComponent = React.lazy(() => import('./components/DiscomPole/AddComponent'));
const AddDiscomLEDComponent = React.lazy(() => import('./components/Discom/AddComponent'));
const AddDiscomWalletComponent = React.lazy(() => import('./components/DiscomWallet/AddComponent'));
const AddHighCourtComponent = React.lazy(() => import('./components/HighCourt/AddComponent'));
const AddMachiyaComponent = React.lazy(() => import('./components/Machiya/AddComponent'));
const AddYavukushComponent = React.lazy(() => import('./components/Yavukush/AddComponent'));
const AddGeneralReceiptComponent = React.lazy(() => import('./components/GeneralReceipt/AddComponent'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
  { path: '/bills/add', name: 'Add Bill', component: AddBillComponent },
  { path: '/bills/list', name: 'Bills List', component: BillsListingComponent },
  { path: '/users/list', name: 'Users List', component: UsersListingComponent },
  { path: '/users/add', name: 'Add User', component: AddUserComponent },
  { path: '/users/edit/:id', name: 'Edit User', component: EditUserComponent },
  { path: '/bsnl-cable', name: 'BSNL Cable', component: AddBSNLCableComponent },
  { path: '/discom-pole', name: 'Discom Pole', component: AddDiscomPoleComponent },
  { path: '/discom-led', name: 'Discom LED', component: AddDiscomLEDComponent },
  { path: '/discom-wallet', name: 'Discom Wallet', component: AddDiscomWalletComponent },
  { path: '/high-court', name: 'High Court', component: AddHighCourtComponent },
  { path: '/machiya', name: 'Machiya', component: AddMachiyaComponent },
  { path: '/yavukush', name: 'Yavukush', component: AddYavukushComponent },
  { path: '/general-receipt', name: 'General Receipt', component: AddGeneralReceiptComponent }
];

export default routes;
