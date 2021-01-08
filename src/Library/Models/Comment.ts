import { AxiosRequestConfig } from 'axios';

import { User } from '../Models';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Debate } from './Debate';

export interface CommentMeta {
  debateId: number | null,
  moderatorId: number | null,
  userId: number | null
}
export interface Comment {
  comment: string;
  created_at: Date | string;
  created_by: User['id'];
  debate: Debate['id'] | Debate;
  id: string;
  meta?: CommentMeta;
  published_at: Date | string;
  replies: (Comment | null)[] | null;
  timestamp: Date | string;
  updated_at: Date | string;
  updated_by: User['id'];
  user: User['id'] | User | null;
}

export type CommentState = ReactReduxRequestState<Comment, AxiosRequestConfig>;
export type CommentsState = ReactReduxRequestState<Comment[], AxiosRequestConfig>;