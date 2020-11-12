import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCookie } from 'react-use';

import { GlobalState, PublicRequestKeys, RequestStatus } from '../../../Library';

export interface AuthCookie {
  jwt: string;
  id: string;
}

export type UseAuthentication = [boolean, {Authorization: string | undefined}, AuthCookie | undefined];

const authenticationChecker = (state: GlobalState[PublicRequestKeys.Authentication]): boolean => 
  state.status === RequestStatus.Loaded && state.result?.jwt && state.result?.jwt.length > 0 ? true : false;

export const useAuthentication = (): UseAuthentication => {
  const authentication = useSelector<
    GlobalState, 
    GlobalState[PublicRequestKeys.Authentication]
  >(
    state => state[PublicRequestKeys.Authentication]
  );
    
  const [cookie, setAuthCookie, deleteAuthCookie] = useCookie('authentication');
  const authCookie = (cookie && JSON.parse(cookie) as AuthCookie) || undefined;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    (authCookie && authCookie.jwt && authCookie.jwt.length > 0 && true) || authenticationChecker(authentication)
  );
 
  useEffect(() => {
    if (!authCookie && isAuthenticated !== authenticationChecker(authentication)) {
      setIsAuthenticated(authenticationChecker(authentication));
    }

    if (!authCookie && isAuthenticated && authentication.result) {
      setAuthCookie(JSON.stringify({
        jwt: authentication.result.jwt,
        id: authentication.result.user.id,
      } as AuthCookie))
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
      Authorization: authCookie && `Bearer ${authCookie.jwt}`
    },
    authCookie,
  ];
}