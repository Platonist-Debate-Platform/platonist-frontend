import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Author } from './Author';
import { Role } from './Role';

export interface User {
  author?: Author | null;
  blocked?: boolean | null;
  confirmed?: boolean | null;
  email: string;
  id: string;
  password: string;
  provider: string;
  resetPasswordToken: string;
  role?: Role | null;
  username: string;
}

export type UserState = ReactReduxRequestState<User, AxiosRequestConfig>;