import { stringify } from 'querystring';
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';

import { GlobalState, PublicRequestKeys } from '../../../Library';
import { useAuthentication } from '../../Hooks';
import { AuthenticationModal } from '../Authentication';

export interface AuthenticationButtonProps {
  component?: ReactElement<any, any>;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  pathToAction?: string;
}

export const AuthenticationButton: FunctionComponent<AuthenticationButtonProps> = ({
  component,
  onClick,
  pathToAction,
}) => {

  const [isAuthenticated] = useAuthentication();
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const router = useSelector<GlobalState, GlobalState[PublicRequestKeys.Router]>(state => state[PublicRequestKeys.Router]);
  
  const searchQuery = '?' + stringify({
    modal: PublicRequestKeys.Authentication,
  });

  const pathname = `${router.location.pathname}${searchQuery}`;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated && !shouldRedirect) {
      setShouldRedirect(true);
    }
    if (isAuthenticated && onClick) {
      onClick(event)
    }
  }

  useEffect(() => {
    const nextPathname = `${router.location.pathname}${router.location.search}`
    if (shouldRedirect && nextPathname === pathname) {
      setShouldRedirect(false);
    }

    if (!shouldRedirect && isAuthenticated && nextPathname === pathname) {
      setShouldRedirect(true);
    }
    
  }, [isAuthenticated, pathname, router.location.pathname, router.location.search, shouldRedirect]);
  
  return (
    <Row>
      <Col className="text-right">
        <AuthenticationModal 
          pathname={pathname}
        />
        {isAuthenticated && pathToAction && (
          <Link 
            className="btn btn-primary"
            to={pathToAction}
          >
            {component || (<>Sign in <i className="fa fa-sign-in-alt" /></>)}
          </Link>
        )}
        {!isAuthenticated && (
          <Button color="primary" onClick={handleClick}>
            {component || (<>Sign in <i className="fa fa-sign-in-alt" /></>)}
          </Button>
        )}
      </Col>
      {shouldRedirect && (
        <Redirect to={!isAuthenticated ? pathname : router.location.pathname} />
      )}
    </Row>
  );
};