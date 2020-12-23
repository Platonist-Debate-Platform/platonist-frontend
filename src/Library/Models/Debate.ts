import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Article } from './Article';
import { Comment } from './Comment';
import { ContentKeys } from './Content';

export interface Debate {
  id: number,
  title: string;
  subTitle: string;
  shortDescription: string;
  articleB: Article | null;
  articleA: Article | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  comments: (Comment[] | null)[] | null;
}

export interface DebateList {
  __component: ContentKeys;
}

export type DebateState = ReactReduxRequestState<Debate, AxiosRequestConfig>;
export type DebatesState = ReactReduxRequestState<Debate[], AxiosRequestConfig>;