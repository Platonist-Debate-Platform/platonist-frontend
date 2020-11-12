import {
  RelevantServices,
  ServiceItem,
  ServiceList,
  ServiceSlider,
} from "./Service";
import { TextWithImage, Text, TextWithList } from "./Text";
import { Jumbotron } from "./Jumbotron";
import { Tab } from "./Tab";
import { JobList } from "./Job";
import { Teaser } from "./Teaser";

export enum ContentKeys {
  BenefitsList = "page-content.benefit-list",
  BranchList = "page-branches.branch-list",
  BranchSlider = "page-branches.branch-slider",
  JobList = "page-jobs.job-list",
  Jumbotron = "page-content.jumbotron",
  RelevantBranches = "page-branches.relevant-branches",
  RelevantServices = "page-services.relevant-services",
  ServiceList = "page-services.service-list",
  ServiceSlider = "page-services.service-slider",
  Tab = "page-content.tab",
  Teaser = "page-content.teaser",
  Text = "page-content.text",
  TextWithImage = "page-content.text-with-image",
  TextWithList = "page-content.text-with-list",
  TextWithListItem = "page-content.text-with-list-item",
  CompanyLocationsListItem = "page-content.company-location-list",
}

export type HomepageContent =
  | JobList
  | Jumbotron
  | Tab
  | Teaser
  | Text
  | TextWithImage
  | TextWithList;

export type PageContent =
  | RelevantServices
  | ServiceItem
  | ServiceList
  | ServiceSlider;

export type Content = HomepageContent & PageContent;
