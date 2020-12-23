import './AuthenticationModal.scss'

import React, { FunctionComponent, useState } from 'react';
import { Button, Col, Collapse, Row } from 'reactstrap';

import { ModalAutomatic } from '../Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export interface AuthenticationModalProps {
  pathname: string;
}

export const AuthenticationModal: FunctionComponent<AuthenticationModalProps> = ({
  pathname,
}) => {

  const [open, setOpen] = useState(false);
  
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <ModalAutomatic 
      pathname={pathname}
      modalHeader={<>Authentication</>}
    >
      <Row>
        <Col md={8} className="offset-md-2">
          <p>
            In order to debate you'll have to sign in. If you don't have an account you could register an account.
          </p>
          <Collapse isOpen={!open}>
            <div className="authentication-modal-login">
              <LoginForm />
            </div>
          </Collapse>
          <Collapse isOpen={open}>
            <div className="authentication-modal-register">
              <RegisterForm />
            </div>
          </Collapse>
          <div className="authentication-modal-toggle">
            <Button size="sm" color="none" onClick={handleClick}>
              {open ? 'Or sign in here' : 'Or sign up now'}
            </Button>
          </div>
        </Col>
      </Row>
    </ModalAutomatic>
  );
}