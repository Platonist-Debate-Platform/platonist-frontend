import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { match as Match, RouteComponentProps } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { Col, Container, Row } from 'reactstrap';

import {
  clearDebateLink,
  DebateLinkDispatch,
  DebateList,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import { CommentList } from '../../Comment';

export interface DebateDetailProps extends WithConfigProps {
  [PublicRequestKeys.Debate]: GlobalState[PublicRequestKeys.Debate];
  [PublicRequestKeys.DebateLink]: GlobalState[PublicRequestKeys.DebateLink],  dispatch: ReactReduxRequestDispatch & DebateLinkDispatch;
  isAdmin: boolean;
  path: string;
  routeProps: RouteComponentProps;
  debateList: DebateList;
}

export const DebateDetailBase: FunctionComponent<DebateDetailProps> = ({
  config,
  debate,
  debateLink,
  dispatch,
  routeProps,
}) => {

  const prevRouterProps = usePrevious(routeProps);

  useEffect(() => {
    const request = () => {
      if (config) {
        const url = config.api.createApiUrl(config.api.config);
        const match = routeProps.match as Match<{ title: string }>;
        url.pathname = debateLink.id ? `debates/${debateLink.id}` : `debates/findByTitle/${match.params.title}`;
  
        dispatch(
          requestAction.load(PublicRequestKeys.Debate, {
            url: url.href,
          })
        );
        if (debateLink.id) {
          
        }
        dispatch(clearDebateLink(undefined));
      }
    }

    if (debate.status === RequestStatus.Initial) {
      request();
    }

    if (
      routeProps.location.pathname !== (prevRouterProps && prevRouterProps.location.pathname) &&
      debate.status !== RequestStatus.Initial
    ) {
      request();
    }

    // return () => {
    //   if (
    //       debate.status === RequestStatus.Loaded &&
    //       routeProps.location.pathname !== (prevRouterProps && prevRouterProps.location.pathname)
    //   ) {
    //     dispatch(requestAction.clear(PublicRequestKeys.Debate));
    //   }
    // }
  }, [config, debate.status, debateLink.id, dispatch, prevRouterProps, routeProps.location.pathname, routeProps.match]);

  return (
      <>
        {debate.result && (
          <>
            <div className="jumbotron-fullscreen jumbotron jumbotron-debate jumbotron-fluid">
              <div className="jumbotron-content">
                <Container>
                  <div className="jumbotron-inner">
                    <Row>
                      <Col col={12} className="text-center">
                        <h1>{debate.result?.title}</h1>
                        <h3>{debate.result?.subTitle}</h3>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </div>
            </div>
            <section className="section section-debate section-debate-detail">
              <CommentList debateId={debate.result.id} />
            </section>
          </>
        )}
      </>
    );
};

export const DebateDetail = connect((state: GlobalState) => ({
  [PublicRequestKeys.Debate]: state[PublicRequestKeys.Debate],
  [PublicRequestKeys.DebateLink]: state[PublicRequestKeys.DebateLink],
}))(withConfig(DebateDetailBase));

export default DebateDetail;
