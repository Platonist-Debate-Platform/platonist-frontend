import * as React from 'react';
import { connect } from 'react-redux';

import {
  GlobalState,
  JobList,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import { JobListLatestContent } from './JobListLatestContent';

type JobListLatestType = JobList & WithConfigProps;

export interface JobListLatestProps extends JobListLatestType {
  [PublicRequestKeys.JobsLatest]: GlobalState[PublicRequestKeys.JobsLatest];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}


export class JobListLatestComponentBase extends React.Component<JobListLatestProps> {
  componentDidMount () {
    const {
      config,
      dispatch,
      jobsLatest,
    } = this.props;

    if ((jobsLatest.status === RequestStatus.Initial || jobsLatest.status === RequestStatus.Loaded) && config) {
      const url = config.api.createApiUrl(config.api.config);
      url.pathname = 'jobs'
      url.search = `_sort=updated_at:ASC&_limit=4`
      dispatch(requestAction.load(PublicRequestKeys.JobsLatest, {
        url: url.href,        
      }));
    }
  }

  componentWillUnmount () {
    const {
      dispatch,
      jobsLatest,
    } = this.props;

    if (jobsLatest.status === RequestStatus.Loaded) {
      dispatch(requestAction.clear(PublicRequestKeys.JobsLatest));
    }
  }

  render () {
    const {
      jobsLatest,
      ...rest
    } = this.props;
    
    return (
      <JobListLatestContent 
        {...rest}
        jobs={jobsLatest}
      />
    );
  }
};

export const JobListLatestComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.JobsLatest]: state[PublicRequestKeys.JobsLatest],
}))(withConfig(JobListLatestComponentBase));

export default JobListLatestComponent;
