import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalState,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '../../../Library';
import { useAuthentication } from './useAuthentication';

export const useRoles = (key: PrivateRequestKeys | PrivateRequestKeys.Roles, id?: string) => {
  
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const [isAuthenticated, headers] = useAuthentication();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `users-permissions/roles${(id && '/' + id) || ''}`;
  
  const roles = useSelector<
  GlobalState, 
  GlobalState[typeof key]
  >(state => state[key]);
    
  useEffect(() => {
    if (isAuthenticated && roles.status === RequestStatus.Initial) {
      dispatch(requestAction.load(key, {
        method: 'GET',
        url: url.href,
        headers,
      }));
    }
  }, [
    dispatch,
    isAuthenticated,
    headers,
    key,
    roles,
    url.href
  ]);

  return roles;
};

export default useRoles;