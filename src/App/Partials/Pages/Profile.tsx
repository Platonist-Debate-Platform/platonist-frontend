import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { PublicRequestKeys, ReactReduxRequestDispatch, requestAction, RequestStatus } from '../../../Library';
import { useComments } from '../../Hooks';
import useUser from '../../Hooks/Requests/useUser';
import { ProfileChangeEmailForm, ProfileChangePasswordForm, ProfileForm, ProfileImage } from '../Profile';

export const PageProfile: FunctionComponent = () => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const {
    user: {
      result: user,
    }
  } = useUser();

  const comments = useComments(user?.id);
  
  useEffect(() => () => {
    if (comments.status === RequestStatus.Loaded) {
      dispatch(requestAction.clear(PublicRequestKeys.Comments));
    }
  }, [comments, dispatch]);
  
  return (
    <section className="section section-profile">
      {user && (
        <Container>
          <Row>
            <Col>
              <h2>Your profile</h2>
              Welcome <b>{user.username}</b>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <ProfileImage />
            </Col>
            <Col md={8}>
              <ProfileForm />
              <ProfileChangePasswordForm />
              <ProfileChangeEmailForm />
            </Col>
          </Row>
        </Container>
      )}
    </section>
  );
}