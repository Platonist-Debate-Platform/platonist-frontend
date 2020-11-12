import { Branch } from "./Branch";
import { Service } from "./Service";
import { Job } from "./Job";

export enum FooterComponentsKeys {
  Branches = 'page-footer.footer-branches',
  Services = 'page-footer.footer-services',
  Jobs = 'page-footer.footer-jobs'
}

export type FooterNavItems = Branch | Service | Job;

export interface FooterNav {
  __component: FooterComponentsKeys;
  id: number;
  items?: (FooterNavItems | null)[] | null;
}