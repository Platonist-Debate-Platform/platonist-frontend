import { Content, ContentKeys } from "./Content";
import { Jumbotron } from "./Jumbotron";
import { Image } from "./Image";
import { ReactReduxRequestState } from "../ReactReduxRequest";
import { AxiosRequestConfig } from "axios";
import { Page } from "./Page";
import { Homepage } from "./Homepage";
import { Author } from "./Author";
import { Contact } from "./Contact";

export interface Job {
  contact?: Author | null;
  content?: (Content | null)[] | null;
  created_at: Date;
  header: Jumbotron;
  homepage?: Homepage | null;
  id: number;
  isActive: boolean;
  lead: string;
  location?: string;
  name: string;
  previewImage: Image;
  startDate: Date | null;
  title: string;
  updated_at: Date;
  page?: Page | null;
  contactBox?: Contact | null;
}

export enum JobListType {
  All = "all",
  Latest = "latest",
}

export interface JobList {
  __component: ContentKeys;
  homepage?: Homepage | null;
  id: number;
  lead: string;
  page?: Page | null;
  title: string;
  type: JobListType;
}

export type JobState = ReactReduxRequestState<Job, AxiosRequestConfig>;
export type JobsState = ReactReduxRequestState<Job[], AxiosRequestConfig>;
