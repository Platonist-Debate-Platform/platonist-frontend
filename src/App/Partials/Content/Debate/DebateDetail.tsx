import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { match as Match, RouteComponentProps } from 'react-router-dom';
import { usePrevious, useUnmount } from 'react-use';
import { Col, Container, Row } from 'reactstrap';

import {
  clearDebateLink,
  Debate,
  DebateLinkDispatch,
  DebateList,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  RequestStatus,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import { RequestSendProps, useDebates } from '../../../Hooks';
import { CommentList } from '../../Comment';

export interface DebateDetailProps extends WithConfigProps {
  [PublicRequestKeys.DebateLink]: GlobalState[PublicRequestKeys.DebateLink];
  dispatch: ReactReduxRequestDispatch & DebateLinkDispatch;
  isAdmin: boolean;
  path: string;
  routeProps: RouteComponentProps;
  debateList: DebateList;
}

export const DebateDetailBase: FunctionComponent<DebateDetailProps> = ({
  config,
  debateLink,
  dispatch,
  routeProps,
}) => {
  const {
    clear,
    state: { result: debate, status },
    send: request,
  } = useDebates<Debate>({
    key: PublicRequestKeys.Debate,
    id: Number(debateLink.id),
    stateOnly: true,
  });

  const prevRouterProps = usePrevious(routeProps);

  useEffect(() => {
    const match = routeProps.match as Match<{ title: string }>;
    const requestProps: RequestSendProps<Debate> = {
      pathname: debateLink.id
        ? `debates/${debateLink.id}`
        : `debates/findByTitle/${match.params.title}`,
      method: 'GET',
    };

    if (status === RequestStatus.Initial) {
      request(requestProps);
    }

    if (
      routeProps.location.pathname !==
        (prevRouterProps && prevRouterProps.location.pathname) &&
      status !== RequestStatus.Initial
    ) {
      request(requestProps);
    }
    if (debateLink && debateLink.id) {
      dispatch(clearDebateLink(undefined));
    }
  }, [
    config,
    debateLink,
    debateLink.id,
    dispatch,
    prevRouterProps,
    request,
    routeProps.location.pathname,
    routeProps.match,
    status,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded) {
      clear();
    }
  });

  return (
    <>
      {debate && (
        <>
          <div className="jumbotron-fullscreen jumbotron jumbotron-debate jumbotron-fluid">
            <div className="jumbotron-content">
              <Container>
                <div className="jumbotron-inner">
                  <Row>
                    <Col col={12} className="text-center">
                      <h1>
                        {debate?.title} {debate.id}
                      </h1>
                      <h3>{debate?.subTitle}</h3>
                    </Col>
                  </Row>
                </div>
              </Container>
            </div>
          </div>
          <section className="section section-debate section-debate-detail">
            <CommentList debateId={debate.id} />
          </section>
        </>
      )}
    </>
  );
};

export const DebateDetail = connect((state: GlobalState) => ({
  [PublicRequestKeys.DebateLink]: state[PublicRequestKeys.DebateLink],
}))(withConfig(DebateDetailBase));

export default DebateDetail;
