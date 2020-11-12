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

type JobListAllType = JobList & WithConfigProps;

export interface JobListAllProps extends JobListAllType {
  [PublicRequestKeys.JobsLatest]: GlobalState[PublicRequestKeys.JobsLatest];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export class JobListAllComponentBase extends React.Component<JobListAllProps> {
  componentDidMount () {
    const {
      config,
      dispatch,
      jobsLatest,
    } = this.props;

    if ((jobsLatest.status === RequestStatus.Initial || jobsLatest.status === RequestStatus.Loaded) && config) {
      const url = config.api.createApiUrl(config.api.config);
      url.pathname = 'jobs'
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
      path,
      jobsLatest,
      ...rest
    } = this.props;
    
    return (
      <JobListLatestContent 
        jobs={jobsLatest}
        {...rest}
      />
    );
  }
};

export const JobListAllComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.JobsLatest]: state[PublicRequestKeys.JobsLatest],
}))(withConfig(JobListAllComponentBase));

export default JobListAllComponent;
