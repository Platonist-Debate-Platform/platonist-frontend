import * as React from 'react';

import { JobList as JobListProps, JobListType } from '../../../../Library';
import JobRoute from './JobRoute';
import JobListLatest from './JobListLatest';
import { RouteComponentProps } from 'react-router-dom';

export interface JobListComponentProps extends JobListProps {
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export const JobList: React.FunctionComponent<JobListComponentProps> = (props) => {
  const {
    type
  } = props;

  switch (type) {
    case JobListType.Latest:
      return <JobListLatest {...props} />
    case JobListType.All:
      return <JobRoute {...props} />
    default:
      return null;
  }
};

export default JobList;
