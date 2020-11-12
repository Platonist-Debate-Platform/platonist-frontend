import { RouterActionType } from "connected-react-router";
import { Location } from "history";

import { AlertState } from "../Alerts";
import { AvailableLanguage } from "../Localize";
import {
  AuthenticationState,
  BranchesState,
  BranchState,
  HomepagesState,
  HomepageState,
  JobsState,
  JobState,
  PagesState,
  PageState,
  RolesState,
  RoleState,
  ServicesState,
  ServiceState,
  UserState,
} from "../Models";
import { PermissionsState, PermissionState } from "../Models/Permission";
import { PrivateRequestKeys, PublicRequestKeys } from "./Keys";

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
  [PublicRequestKeys.Branch]: BranchState;
  [PublicRequestKeys.Branches]: BranchesState;
  [PublicRequestKeys.Homepage]: HomepageState;
  [PublicRequestKeys.Homepages]: HomepagesState;
  [PublicRequestKeys.Job]: JobState;
  [PublicRequestKeys.Jobs]: JobsState;
  [PublicRequestKeys.JobsLatest]: JobsState;
  [PublicRequestKeys.Locals]: AvailableLanguage,
  [PublicRequestKeys.Page]: PageState;
  [PublicRequestKeys.Pages]: PagesState;
  [PublicRequestKeys.Router]: RouterState;
  [PublicRequestKeys.Service]: ServiceState;
  [PublicRequestKeys.Services]: ServicesState;
  [PublicRequestKeys.ServicesFilter]: ServicesState;
}

export interface PrivateState {
  [PrivateRequestKeys.Permission]: PermissionState,
  [PrivateRequestKeys.Permissions]: PermissionsState,
  [PrivateRequestKeys.Role]: RoleState,
  [PrivateRequestKeys.Roles]: RolesState,
  [PrivateRequestKeys.User]: UserState,
}

export type GlobalState = PublicState & PrivateState;
