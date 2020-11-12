import { Relevant, Service, ServiceList } from './Service';
import { Page } from './Page';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { AxiosRequestConfig } from 'axios';

export interface Branch extends Service {}

export interface RelevantBranches extends Relevant<BranchItem> {
  page?: Page | null;
}

export interface BranchItem {
  id: number;
  branch: Service,
}

export interface BranchList extends ServiceList {}

export type BranchState = ReactReduxRequestState<Branch, AxiosRequestConfig>
export type BranchesState = ReactReduxRequestState<Branch[], AxiosRequestConfig>