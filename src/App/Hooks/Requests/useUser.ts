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

export const useUser = (id?: string) => {
  
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const [isAuthenticated, state, cookie] = useAuthentication();
  const url = config.createApiUrl(config.api.config);
  const userId = id || cookie?.id;
  url.pathname = `users/${userId}`;
  
  const user = useSelector<
  GlobalState, 
  GlobalState[PrivateRequestKeys.User]
  >(state => state[PrivateRequestKeys.User]);
    
  useEffect(() => {
    if (userId && isAuthenticated && user.status === RequestStatus.Initial) {
      dispatch(requestAction.load(PrivateRequestKeys.User, {
        method: 'GET',
        url: url.href,
        withCredentials: true,
      }));
    }
  }, [dispatch, isAuthenticated, user, url.href, state.status, userId]);

  return user;
};

export default useUser;