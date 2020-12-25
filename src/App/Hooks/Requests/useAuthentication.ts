import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCookie } from 'react-use';

import { GlobalState, PublicRequestKeys, RequestStatus } from '../../../Library';

export interface AuthCookie {
  status: string;
  id: string;
}

export type UseAuthentication = [boolean, {status: string | undefined}, AuthCookie | undefined];

const authenticationChecker = (state: GlobalState[PublicRequestKeys.Authentication]): boolean => 
  state.status === RequestStatus.Loaded && state.result?.status === 'Authenticated' ? true : false;

export const useAuthentication = (): UseAuthentication => {
  const authentication = useSelector<
    GlobalState, 
    GlobalState[PublicRequestKeys.Authentication]
  >(
    state => state[PublicRequestKeys.Authentication]
  );
    
  const [cookie, setAuthCookie, deleteAuthCookie] = useCookie('authStatus');
  const authCookie = (cookie && JSON.parse(cookie) as AuthCookie) || undefined;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    (authCookie && authCookie.status && authCookie.status === 'Authenticated' && true) || authenticationChecker(authentication)
  );
 
  useEffect(() => {
    if (!authCookie && isAuthenticated !== authenticationChecker(authentication)) {
      setIsAuthenticated(authenticationChecker(authentication));
    }

    if (!authCookie && isAuthenticated && authentication.result) {
      setAuthCookie(JSON.stringify({
        status: authentication.result.status,
        id: authentication.result.user.id,
      } as AuthCookie))
    }

    if (isAuthenticated && authentication.result?.status === 'Unauthorized') {
      deleteAuthCookie();
      setIsAuthenticated(false);
    }

    // if (isAuthenticated && !authenticationChecker(authentication) && (authCookie && authCookie.jwt && authCookie.jwt.length > 0 && true)) {
    //   setIsAuthenticated(false);
    //   deleteAuthCookie();
    // }
  }, [
    authCookie,
    authentication,
    deleteAuthCookie,
    isAuthenticated,
    setAuthCookie,
  ]); 

  return [
    isAuthenticated, {
      status: authCookie && authCookie.status,
    },
    authCookie,
  ];
}