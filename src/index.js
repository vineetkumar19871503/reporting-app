import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/';

async function init() {
    const { store, persistor } = await configureStore();
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>,
        document.getElementById('root')
    );
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
}
init();
