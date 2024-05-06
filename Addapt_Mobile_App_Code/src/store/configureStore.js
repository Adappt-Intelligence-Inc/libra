import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createReducerManager} from './reducerManager';
import auth from './authReducer';
import notifications from './notifications';
import devices from './devicesReducer';

const initialReducers = {
  auth,
  notifications,
  devices,
};

export default function configureStore(preloadedState) {
  const reducerManager = createReducerManager(initialReducers);

  const store = createStore(
    reducerManager.reduce,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk)),
  );

  store.reducerManager = reducerManager;

  return store;
}
