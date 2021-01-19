import './EmailConfirmation.scss';

import React, { FunctionComponent, useState } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import { useAuthentication } from '../../Hooks';
import useUser from '../../Hooks/Requests/useUser';
import { Link } from 'react-router-dom';

export const EmailConfirmation: FunctionComponent<{}> = () => {
  const [isAuthenticated] = useAuthentication();
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);

  const {
    user: {
      result: user,
    }
  } = useUser();
  
  if (!isAuthenticated || (isAuthenticated && !user) || (isAuthenticated && user && user.confirmed)) {
    return null;
  };

  return (
    <div className="authentication-email-confirmation">
      <Container>
        <Row>
          <Col>
            <Alert color="info" isOpen={visible} toggle={onDismiss}>
              Your account email is not confirmed, please check your mailbox and double opt-in. If you didn't get the mail please <Link className="alert-link" to="/user/me?modal=change-email">
              change your email </Link> or <Link className="alert-link" to="/auth/resend-confirmation">resend confirmation</Link>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};