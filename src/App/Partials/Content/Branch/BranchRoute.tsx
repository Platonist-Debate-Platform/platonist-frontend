import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { GlobalState, PublicRequestKeys, BranchList as BranchListProps } from '../../../../Library';
import BranchDetail from './BranchDetail';
import BranchListComponent from './BranchList';

export interface BranchRouteProps extends BranchListProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router],
  dispatch: unknown;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export const BranchRouteBase: React.FC<BranchRouteProps> = (props) => {
  const {
    dispatch,
    isAdmin,
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
  ])
  
  if (rest.path === location.pathname) {
    return <BranchListComponent {...rest} />
  }

  if (location.pathname.startsWith(rest.path) && routeProps) {
    return <BranchDetail branchList={rest} routeProps={routeProps} path={rest.path} isAdmin={isAdmin} />
  }
    
  return null;
};

export const BranchRoute = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(BranchRouteBase);

export default BranchRoute;