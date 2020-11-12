import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { GlobalState, PublicRequestKeys, ServiceList as ServiceListProps } from '../../../../Library';
import ServiceDetail from './ServiceDetail';
import ServiceListComponent from './ServiceList';

export interface ServiceRouteProps extends ServiceListProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router],
  dispatch: unknown;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export const ServiceRouteBase: React.FC<ServiceRouteProps> = (props) => {
  const {
    dispatch,
    isAdmin,
    path,
    routeProps,
    router,
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
  
  if (path === location.pathname) {
    return <ServiceListComponent {...rest} path={path} />
  }

  if (location.pathname.startsWith(path) && routeProps) {
    return <ServiceDetail 
      isAdmin={isAdmin}
      path={path}
      routeProps={routeProps} 
      serviceList={rest} 
    />
  }
    
  return null;
};

export const ServiceRoute = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(ServiceRouteBase);

export default ServiceRoute;