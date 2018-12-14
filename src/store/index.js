import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import UserReducer from '../reducers/UserReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
export default function configureStore() {
    return new Promise((resolve, reject) => {
        try {
            const rootReducer = combineReducers(
                { user: UserReducer },
                {},
                compose(applyMiddleware(thunk))
            );
            const persistConfig = {
                key: 'root',
                storage,
            }
            const persistedReducer = persistReducer(persistConfig, rootReducer);
            const store = createStore(persistedReducer);
            const persistor = persistStore(store)
            resolve({ store, persistor });
        } catch (e) {
            reject(e);
        }
    });
}
