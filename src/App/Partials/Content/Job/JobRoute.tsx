import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { GlobalState, PublicRequestKeys, JobList as JobListProps } from '../../../../Library';
import JobDetail from './JobDetail';
import JobListComponent from './JobListAll';

export interface JobRouteProps extends JobListProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router],
  dispatch: unknown;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export const JobRouteBase: React.FC<JobRouteProps> = (props) => {
  const {
    dispatch,
    isAdmin,
    path,
    router,
    routeProps,
    ...rest
  } = props;
  
  const [location, setLocation] = useState(router.location);
    
  useEffect(() => {
    if (router.location.key !== location.key) {
      setLocation(router.location);
    }
  }, [
    location,
    router.location,
    setLocation,
  ]);
  
  if (path === location.pathname) {
    return <JobListComponent {...rest} path={path} />
  }

  if (location.pathname.startsWith(path) && routeProps) {
    return <JobDetail
      isAdmin={isAdmin} 
      jobList={rest} 
      routeProps={routeProps} 
      path={path}
    />
  }
    
  return null;
};

export const JobRoute = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(JobRouteBase);

export default JobRoute;