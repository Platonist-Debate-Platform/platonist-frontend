import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'

import { ReactReduxRequest } from '../ReactReduxRequest/ReactReduxRequest';
import { PrivateRequestKeys, PublicRequestKeys } from './Keys';
import { alertReducer } from '../Alerts';
import { localizeReducer } from '../Localize';

const getRequestKeys = (requestKeys: Object): string[] => 
  Object.keys(requestKeys).map((key) => requestKeys[key as never]);

export const reactReduxRequest = new ReactReduxRequest({
  identifiers: {
    secure: getRequestKeys(PrivateRequestKeys),
    public: getRequestKeys(PublicRequestKeys),
  },
  settings: {},
});

export const createRootReducer = (history: History) => combineReducers({
  ...reactReduxRequest.createReducer(),
  alerts: alertReducer,
  locals: localizeReducer,
  router: connectRouter(history),
});

export default createRootReducer;