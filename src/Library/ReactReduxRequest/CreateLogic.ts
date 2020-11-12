import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { Agent } from 'https';
import { isArray } from 'lodash';
import { createLogic, StandardAction } from 'redux-logic';

import { alertAction, AlertTypes, ToggleType } from '../Alerts';
import { randomHash } from '../Utils';
import { failRequest, receiveRequest } from './CreateAction';
import { RequestActionType } from './Keys';
import { KeysOfRequestIDs, ReactReduxRequestError } from './Types';
import { createRequestActionType, getStrapiErrorMessages } from './Utils';

const idDevelopment = process.env.NODE_ENV === 'development' ? true : false;
const axiosInstance = idDevelopment ? axios.create({
  httpsAgent: new Agent({  
    rejectUnauthorized: false
  })
}) : axios; 

const httpRequest = <Payload extends Object>(config: AxiosRequestConfig) => axiosInstance(config) as AxiosPromise<Payload>;

export const createRequestLogic = <
  State extends Object = {}, 
  Payload extends Object = {}, 
  Meta extends Object = {},
  Dependency extends object = {},
  Context extends Object = {},
>(id: KeysOfRequestIDs, requestConfig: AxiosRequestConfig) => createLogic<State, Payload, Meta, Dependency, Context, ReturnType<typeof createRequestActionType>, StandardAction<string, Payload, Meta>>({
  cancelType: createRequestActionType(RequestActionType.Cancel, id),
  type: createRequestActionType(RequestActionType.Load, id),
  process: (process, dispatch, done) => {
    const meta = process.action.meta as AxiosRequestConfig;
    
    httpRequest(Object.assign({}, requestConfig, meta || {}))
      .then(({config, data, status, statusText}) => {
        dispatch(receiveRequest(id, data, {
          status,
          statusText,
          config
        }));
      })
      .catch((axiosError: AxiosError) => {
        const error = axiosError.response?.data as ReactReduxRequestError;
        const message = (error && isArray(error.message) && getStrapiErrorMessages(error.message)) || (error && error.message) || 'Holy cow, something went wrong';

        dispatch(failRequest(id, error, meta));
        dispatch(alertAction.add({
          state: ToggleType.Show,
          message,
          id: randomHash(),
          type: AlertTypes.Danger,
        }))
      })
      .finally(() => done());
  }
});