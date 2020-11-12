import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, match as Match, Link } from 'react-router-dom';

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  BranchList,
  WithConfigProps,
  withConfig,
  Branch,
} from '../../../../Library';
import { JumbotronComponent } from '../Jumbotron';
import { Container, Row, Col } from 'reactstrap';
import ContentResolver from '../ContentResolver';

export interface BranchDetailProps extends WithConfigProps {
  [PublicRequestKeys.Branches]: GlobalState[PublicRequestKeys.Branches];
  branchList: BranchList;
  dispatch: ReactReduxRequestDispatch;
  isAdmin: boolean;
  path: string;
  routeProps: RouteComponentProps,
}

export class BranchDetailBase extends React.Component<BranchDetailProps> {
  request () {
    const {
      config,
      dispatch,
      routeProps,
    } = this.props;

    if (config) {
      const url = config.api.createApiUrl(config.api.config);
      const match = routeProps.match as Match<{title: string}>;
      url.pathname = 'branches'
      url.search = 'title=' + match.params.title;

      dispatch(requestAction.load(PublicRequestKeys.Branches, {
        url: url.href,        
      }));
    }
  }

  public componentDidMount () {
    this.request();
  }

  public componentDidUpdate(prevProps: BranchDetailProps) {
    const {
      routeProps,
    } = this.props;

    if (routeProps.location.pathname !== prevProps.routeProps.location.pathname) {
      this.request();
    }
  }

  public componentWillUnmount () {
    const {
      dispatch,
      branches,
    } = this.props;

    if (branches.status === RequestStatus.Loaded) {
      dispatch(requestAction.clear(PublicRequestKeys.Branches));
    }
  }

  private get branch (): Branch | undefined {
    const {
      branches,
    } = this.props;

    return branches.result && branches.result.length > 0 && branches.result[0] ? branches.result[0] : undefined;
  }

  render () {       
    const {
      isAdmin,
      path,
    } = this.props;

    return (
      <>
        {this.branch && (
          <JumbotronComponent {...this.branch.header} />
        )}
        <section className="section section-detail section-detail-branch">
          <div className="page-content-text-lead">
            <Container>
              <Row>
                <Col md={10} className="offset-md-1">
                  <p className="lead">
                    {this.branch?.lead}
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
          {this.branch && (
            <ContentResolver contents={this.branch.content} path={path} isAdmin={isAdmin} />
          )}
        </section>
        
        {this.branch?.page && (
          <section className="section section-detail-footer">
            <Container fluid={true}>
              <Row>
                <Col>
                  <Link to={encodeURI(`/${this.branch.page.title}`)} title={this.branch.page.name || this.branch.page.title}>
                    <i className="icon icon-arrow-left" />
                    <span className="ml-3">
                      Zurück zur {this.branch.page.name || this.branch.page.title} Übersicht
                    </span>
                  </Link>
                </Col>
              </Row>
            </Container>
          </section>
        )}
      </>
    );
  }
}

export const BranchDetail = connect((state: GlobalState) => ({
  [PublicRequestKeys.Branches]: state[PublicRequestKeys.Branches],
}))(withConfig(BranchDetailBase));

export default BranchDetail;
