import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';

import { useAuthentication } from '../../Hooks';
import { LoginForm } from '../Authentication';

export const PageLogin: FunctionComponent = () => {

  const [isAuthenticated] = useAuthentication();
  
  if (!isAuthenticated) {
    return (
      <LoginForm />
    );
  }

  return (
    <Redirect to="/admin"></Redirect>
  );
};

export default PageLogin;