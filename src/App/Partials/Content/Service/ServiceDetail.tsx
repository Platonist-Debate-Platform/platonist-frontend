import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match as Match, Link } from "react-router-dom";

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  ServiceList,
  WithConfigProps,
  withConfig,
  Service,
} from "../../../../Library";
import { JumbotronComponent } from "../Jumbotron";
import { Container, Col, Row } from "reactstrap";
import ContentResolver from "../ContentResolver";

export interface ServiceDetailProps extends WithConfigProps {
  [PublicRequestKeys.ServicesFilter]: GlobalState[PublicRequestKeys.ServicesFilter];
  dispatch: ReactReduxRequestDispatch;
  isAdmin: boolean;
  path: string;
  routeProps: RouteComponentProps;
  serviceList: ServiceList;
}

export class ServiceDetailBase extends React.Component<ServiceDetailProps> {
  private request() {
    const { config, dispatch, routeProps } = this.props;

    if (config) {
      const url = config.api.createApiUrl(config.api.config);
      const match = routeProps.match as Match<{ title: string }>;
      url.pathname = "services";
      url.search = "title=" + match.params.title;

      dispatch(
        requestAction.load(PublicRequestKeys.ServicesFilter, {
          url: url.href,
        })
      );
    }
  }

  public componentDidMount() {
    this.request();
  }

  public componentDidUpdate(prevProps: ServiceDetailProps) {
    const { routeProps } = this.props;

    if (
      routeProps.location.pathname !== prevProps.routeProps.location.pathname
    ) {
      this.request();
    }
  }

  public componentWillUnmount() {
    const { dispatch, servicesFilter } = this.props;

    if (servicesFilter.status === RequestStatus.Loaded) {
      dispatch(requestAction.clear(PublicRequestKeys.ServicesFilter));
    }
  }

  private get service(): Service | undefined {
    const { servicesFilter } = this.props;

    return servicesFilter.result &&
      servicesFilter.result.length > 0 &&
      servicesFilter.result[0]
      ? servicesFilter.result[0]
      : undefined;
  }

  render() {
    const { 
      path,
      isAdmin,
    } = this.props;

    return (
      <>
        {this.service && <JumbotronComponent {...this.service.header} />}
        <section className="section section-detail section-detail-service">
          <div className="page-content-text-lead">
            <Container>
              <Row>
                <Col md={10} className="offset-md-1">
                  <p className="lead">{this.service?.lead}</p>
                </Col>
              </Row>
            </Container>
          </div>
          {this.service && (
            <ContentResolver 
              contents={this.service.content} 
              isAdmin={isAdmin}
              path={path}
            />
          )}
        </section>
        {this.service?.page && (
          <section className="section section-detail-footer">
            <Container fluid={true}>
              <Row>
                <Col>
                  <Link
                    to={encodeURI(`/${this.service.page.title}`)}
                    title={this.service.page.name || this.service.page.title}
                  >
                    <i className="icon icon-arrow-left" />
                    <span className="ml-3">
                      Zurück zur{" "}
                      {this.service.page.name || this.service.page.title}{" "}
                      Übersicht
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

export const ServiceDetail = connect((state: GlobalState) => ({
  [PublicRequestKeys.ServicesFilter]: state[PublicRequestKeys.ServicesFilter],
}))(withConfig(ServiceDetailBase));

export default ServiceDetail;
