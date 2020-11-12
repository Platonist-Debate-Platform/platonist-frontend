import { cancelRequest, failRequest, loadRequest, receiveRequest, updateRequest } from './CreateAction';
import { RequestStatus } from './Keys';

export interface RequestIDs {
  public: string[];
  secure: string[];
}

export interface ReactReduxRequestProps {
  identifiers: RequestIDs;
  settings: Object;
}

export type ValuesOf<T extends any[]>= T[number];

export type KeysOfRequestIDs = ValuesOf<RequestIDs['public'] | RequestIDs['secure']>;

export type ReactReduxRequestActions = 
  | ReturnType<typeof cancelRequest>
  | ReturnType<typeof failRequest>
  | ReturnType<typeof loadRequest>
  | ReturnType<typeof receiveRequest>
  | ReturnType<typeof updateRequest>;

export interface ReactReduxRequestDispatch {
  <A extends ReactReduxRequestActions>(action: A): A;
}

export interface ReactReduxRequestErrorDetail {
  code: string,
  info: {type: string},
  message: string,
  path: string,
}

export interface ReactReduxRequestErrorMessage {
  id: string
  message: string
}

export type StrapiErrorMessage = {messages: ReactReduxRequestErrorMessage[]};

export interface ReactReduxRequestError {
  code: string;
  details: ReactReduxRequestErrorDetail[];
  message: string | StrapiErrorMessage[];
  name: string;
  statusCode: number;
}

export interface ReactReduxRequestState<Payload extends Object, Meta extends Object> {
  error?: ReactReduxRequestError;
  hash: string;
  id: KeysOfRequestIDs;
  meta?: Meta & {config?: Meta},
  result?: Payload
  status: RequestStatus;
}