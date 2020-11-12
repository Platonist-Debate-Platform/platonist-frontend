import React from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  BenefitList as BenefitListProps,
  BranchList as BranchListProps,
  Content,
  ContentKeys,
  JobList as JobListProps,
  Jumbotron,
  RelevantBranches as RelevantBranchesProps,
  ServiceList as ServiceListProps,
  ServiceSlider as ServiceSliderProps,
  Tab as TabProps,
  Teaser as TeaserProps,
  Text,
  TextWithImage as TextWithImageProps,
  TextWithList as TextWithListProps,
  CompanyLocationList as CompanyLocationListProps,
} from "../../../Library";
import { BenefitsList } from "./Benefit";
import { BranchRoute } from "./Branch";
import { RelevantBranches } from "./Branch/RelevantBranches";
import { CompanyLocationsList } from "./CompanyLocation";
import { JobList } from "./Job";
import { JumbotronComponent } from "./Jumbotron";
import { ServiceRoute, ServiceSlider } from "./Service";
import { TabPage } from "./Tab";
import { Teaser } from "./Teaser";
import { TextComponent, TextWithImage, TextWithList } from "./Text";

export interface ContentResolverProps {
  contents: (Content | null)[] | null;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export interface ContentResolverItemExtendedProps {
  isAdmin: boolean;
  path: string;
}

export interface ContentResolverItemDefaultProps extends ContentResolverItemExtendedProps {
  routeProps?: RouteComponentProps;
}

export type ContentResolverItemProps = Content &
  ContentResolverItemDefaultProps;

export const ContentResolverItem: React.FC<ContentResolverItemProps> = (
  props
) => {
  const { __component } = props;

  switch (__component) {
    case ContentKeys.BenefitsList:
      return <BenefitsList {...(props as BenefitListProps)} />;

    case ContentKeys.BranchList:
      return <BranchRoute {...(props as BranchListProps & ContentResolverItemExtendedProps)} />;

    case ContentKeys.JobList:
      return <JobList {...(props as JobListProps & ContentResolverItemExtendedProps)} />;

    case ContentKeys.Jumbotron:
      return <JumbotronComponent {...(props as Jumbotron)} />;

    case ContentKeys.RelevantBranches:
    case ContentKeys.RelevantServices:
      return <RelevantBranches {...(props as RelevantBranchesProps)} />;

    case ContentKeys.ServiceList:
      return (
        <ServiceRoute {...(props as ServiceListProps & ContentResolverItemExtendedProps)} />
      );

    case ContentKeys.ServiceSlider:
    case ContentKeys.BranchSlider:
      return <ServiceSlider {...(props as ServiceSliderProps)} />;

    case ContentKeys.Tab:
      return <TabPage {...(props as TabProps)} />;

    case ContentKeys.Teaser:
      return (
        <Teaser {...(props as TeaserProps & ContentResolverItemDefaultProps)} />
      );

    case ContentKeys.Text:
      return <TextComponent {...(props as Text)} />;

    case ContentKeys.TextWithImage:
      return <TextWithImage {...(props as TextWithImageProps)} />;

    case ContentKeys.TextWithList:
      return <TextWithList {...(props as TextWithListProps)} />;

    case ContentKeys.CompanyLocationsListItem:
      return <CompanyLocationsList {...(props as CompanyLocationListProps)} />;
    default:
      return null;
  }
};

export const ContentResolver: React.FC<ContentResolverProps> = ({
  contents,
  isAdmin,
  path,
  routeProps,
}) => {
  return (
    <>
      {contents && contents.length > 0
        ? contents.map((content, index) => (
            <React.Fragment
              key={`content_item_${content?.__component}_${index}`}
            >
              {content && (
                <ContentResolverItem
                  {...content}
                  isAdmin={isAdmin}
                  path={path}
                  routeProps={routeProps}
                />
              )}
            </React.Fragment>
          ))
        : null}
    </>
  );
};

export default ContentResolver;
