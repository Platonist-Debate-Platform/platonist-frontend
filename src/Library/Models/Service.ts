import { AxiosRequestConfig } from "axios";

import { ReactReduxRequestState } from "../ReactReduxRequest";
import { Content, ContentKeys } from "./Content";
import { Image } from "./Image";
import { Jumbotron } from "./Jumbotron";
import { Page } from "./Page";
import { Contact } from "./Contact";

export interface Service {
  content: Content[];
  created_at: Date;
  header: Jumbotron;
  id: number;
  lead: string;
  page?: Page | null;
  previewImage: Image;
  previewLead?: string;
  title: string;
  updated_at: Date;
  contact?: Contact | null;
  isActive?: boolean;
}

export interface Relevant<Data> {
  __component: ContentKeys;
  title: string;
  lead?: string | null;
  relevant?: (Data | null)[] | null;
}

export interface RelevantServices extends Relevant<ServiceItem> {
  page?: Page | null;
}

export interface ServiceItem {
  id: number;
  service: Service;
}

export interface ServiceList {
  __component: ContentKeys;
  title: string;
  isActive: boolean;
}

export interface ServiceSlider {
  __component: ContentKeys;
  callToAction: string | null;
  hidden: boolean;
  id: number;
  lead?: string | null;
  page?: Page | null;
  slides?: (ServiceItem | null)[] | null;
  title: string;
}

export type ServiceState = ReactReduxRequestState<Service, AxiosRequestConfig>;
export type ServicesState = ReactReduxRequestState<
  Service[],
  AxiosRequestConfig
>;
