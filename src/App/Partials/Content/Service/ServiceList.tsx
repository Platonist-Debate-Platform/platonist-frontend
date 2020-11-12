import * as React from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  ServiceList,
  withConfig,
  WithConfigProps,
} from "../../../../Library";
import { BranchItem } from "../Branch";

type ServiceListType = ServiceList & WithConfigProps;

export interface ServiceListProps extends ServiceListType {
  [PublicRequestKeys.Services]: GlobalState[PublicRequestKeys.Services];
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export class ServiceListComponentBase extends React.Component<
  ServiceListProps
> {
  componentDidMount() {
    const { config, dispatch, services, page } = this.props;

    if (services.status === RequestStatus.Initial && config) {
      const url = config.api.createApiUrl(config.api.config);
      url.pathname = 'services';

      url.search = (page && page.result && `?page.id=${page.result.id}`) || '';
      
      dispatch(
        requestAction.load(PublicRequestKeys.Services, {
          url: url.href,
        })
      );
    }
  }

  componentWillUnmount() {
    const { dispatch, services } = this.props;

    if (services.status === RequestStatus.Loaded) {
      dispatch(requestAction.clear(PublicRequestKeys.Services));
    }
  }

  render() {
    const { page, services } = this.props;

    const result = this.props.services.result;

    return (
      <>
        {services.status === RequestStatus.Loaded && result && (
          <Container fluid={true} className="p-md-0">
            <Row className="m-md-0 p-md-0">
              <Col md={12} className="p-md-0 m-md-0">
                {page &&
                  page.result &&
                  result.map((item, index) => {
                    return (
                      (item && item.isActive && (
                        <BranchItem
                          {...item}
                          index={index}
                          key={`relevant_branch_item_${item.id}_${index}`}
                          page={page.result}
                        />
                      )) ||
                      null
                    );
                  })}
              </Col>
            </Row>
          </Container>
        )}
      </>
    );
  }
}

export const ServiceListComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Services]: state[PublicRequestKeys.Services],
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
}))(withConfig(ServiceListComponentBase));

export default ServiceListComponent;
