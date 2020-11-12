import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { User } from './User';

export interface Authentication {
  jwt: string;
  user: User
}

export type AuthenticationState = ReactReduxRequestState<Authentication, AxiosRequestConfig>;