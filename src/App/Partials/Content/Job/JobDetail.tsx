import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  match as Match,
  Redirect,
  Link,
} from "react-router-dom";

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  JobList,
  WithConfigProps,
  withConfig,
  Job,
} from "../../../../Library";
import { JumbotronComponent } from "../Jumbotron";
import { Container, Col, Row } from "reactstrap";
import ContentResolver from "../ContentResolver";
import JobInformation from "./JobInformation";

export interface JobDetailProps extends WithConfigProps {
  [PublicRequestKeys.Jobs]: GlobalState[PublicRequestKeys.Jobs];
  dispatch: ReactReduxRequestDispatch;
  isAdmin: boolean;
  jobList: JobList;
  path: string;
  routeProps: RouteComponentProps;
}

export class JobDetailBase extends React.Component<JobDetailProps> {
  private request() {
    const { config, dispatch, routeProps } = this.props;

    if (config) {
      const url = config.api.createApiUrl(config.api.config);
      const match = routeProps.match as Match<{ title: string }>;
      url.pathname = "jobs";
      url.search = "title=" + match.params.title;

      dispatch(
        requestAction.load(PublicRequestKeys.Jobs, {
          url: url.href,
        })
      );
    }
  }

  public componentDidMount() {
    this.request();
  }

  public componentDidUpdate(prevProps: JobDetailProps) {
    const { routeProps } = this.props;

    if (
      routeProps.location.pathname !== prevProps.routeProps.location.pathname
    ) {
      this.request();
    }
  }

  private get job(): Job | undefined {
    const { jobs } = this.props;

    return jobs.result && jobs.result.length > 0 && jobs.result[0]
      ? jobs.result[0]
      : undefined;
  }

  render() {
    const { 
      isAdmin,
      path, 
    } = this.props;

    return (
      <>
        {this.job ? (
          <>
            <JumbotronComponent {...this.job.header} />
            <section className="section section-detail section-detail-job">
              <div className="page-content-text-lead">
                <Container>
                  <Row>
                    <Col md={10} className="offset-md-1">
                      <p className="lead">{this.job.lead}</p>
                    </Col>
                  </Row>
                </Container>
              </div>
              {this.job && (
                <ContentResolver
                  contents={this.job.content as any}
                  isAdmin={isAdmin}
                  path={path}
                />
              )}

              <div className="page-content-text page-content-text-job">
                <Container>
                  <Row>
                    <Col md={10} className="offset-md-1 mt-3">
                      <JobInformation {...this.job} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={10} className="offset-md-1 mt-3">
                      <a
                        className="btn btn-green btn-sized"
                        href={`mailto: ${
                          (this.job.contact && this.job.contact.email) ||
                          "recruiting@globalct.com"
                        }`}
                        title="Jetzt Bewerben"
                      >
                        Jetzt Bewerben
                      </a>
                    </Col>
                  </Row>
                </Container>
              </div>
            </section>
            {this.job?.page && (
              <section className="section section-detail-footer">
                <Container fluid={true}>
                  <Row>
                    <Col>
                      <Link
                        to={encodeURI(`/${this.job.page.title}`)}
                        title={this.job.page.name || this.job.page.title}
                      >
                        <i className="icon icon-arrow-left" />
                        <span className="ml-3">
                          Zurück zur {this.job.page.name || this.job.page.title}{" "}
                          Übersicht
                        </span>
                      </Link>
                    </Col>
                  </Row>
                </Container>
              </section>
            )}
          </>
        ) : (
          <>
            {(this.props.jobs.status === RequestStatus.Loaded ||
              this.props.jobs.status === RequestStatus.Error) && (
              <Redirect to="/404" />
            )}
          </>
        )}
      </>
    );
  }
}

export const JobDetail = connect((state: GlobalState) => ({
  [PublicRequestKeys.Jobs]: state[PublicRequestKeys.Jobs],
}))(withConfig(JobDetailBase));

export default JobDetail;
