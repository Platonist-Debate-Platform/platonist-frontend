import { AxiosRequestConfig } from 'axios';
import { RouterActionType } from 'connected-react-router';
import { Location } from 'history';

import { AlertState } from '../Alerts';
import { DebateLinkState } from '../DebateLink';
import { AvailableLanguage } from '../Localize';
import {
  AuthenticationState,
  CommentsState,
  CommentState,
  DebatesState,
  DebateState,
  FileState,
  HomepagesState,
  HomepageState,
  PagesState,
  PageState,
  RolesState,
  RoleState,
  UserState,
} from '../Models';
import { PermissionsState, PermissionState } from '../Models/Permission';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { PrivateRequestKeys, PublicRequestKeys } from './Keys';

export type LocationState<Q extends Object | undefined> = Location & {
  query: Q;
};

export interface RouterState {
  location: Location;
  action: RouterActionType;
}

export interface PublicState {
  [PublicRequestKeys.Alerts]: AlertState;
  [PublicRequestKeys.Authentication]: AuthenticationState;
  [PublicRequestKeys.Comments]: CommentsState;
  [PublicRequestKeys.Debate]: DebateState;
  [PublicRequestKeys.DebateLink]: DebateLinkState;
  [PublicRequestKeys.Debates]: DebatesState;
  [PublicRequestKeys.Homepage]: HomepageState;
  [PublicRequestKeys.Homepages]: HomepagesState;
  [PublicRequestKeys.Locals]: AvailableLanguage,
  [PublicRequestKeys.Page]: PageState;
  [PublicRequestKeys.Pages]: PagesState;
  [PublicRequestKeys.Router]: RouterState;
}

export interface PrivateState {
  [PrivateRequestKeys.Comment]: CommentState;
  [PrivateRequestKeys.File]: FileState;
  [PrivateRequestKeys.Permission]: PermissionState,
  [PrivateRequestKeys.Permissions]: PermissionsState,
  [PrivateRequestKeys.Role]: RoleState,
  [PrivateRequestKeys.Roles]: RolesState,
  [PrivateRequestKeys.Upload]: ReactReduxRequestState<any, AxiosRequestConfig>;
  [PrivateRequestKeys.User]: UserState,
}

export type GlobalState = PublicState & PrivateState;

export interface Dispatch<Action> {
  <A extends Action>(action: A): A;
}