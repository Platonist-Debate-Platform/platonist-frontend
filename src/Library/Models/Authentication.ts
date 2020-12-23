import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { User } from './User';

export interface Authentication {
  status: string;
  user: User
}

export type AuthenticationState = ReactReduxRequestState<Authentication, AxiosRequestConfig>;