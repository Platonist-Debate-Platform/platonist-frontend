import * as React from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import {
  BranchList,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import BranchItem from './BranchItem';

type BranchListType = BranchList & WithConfigProps;

export interface BranchListProps extends BranchListType {
  [PublicRequestKeys.Branches]: GlobalState[PublicRequestKeys.Branches];
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export class BranchListComponentBase extends React.Component<BranchListProps> {
  componentDidMount () {
    const {
      config,
      dispatch,
      branches,
      page,
    } = this.props;

    if (branches.status === RequestStatus.Initial && config) {
      const url = config.api.createApiUrl(config.api.config);
      
      url.pathname = 'branches'
      url.search = (page && page.result && `?page.id=${page.result.id}`) || '';

      dispatch(requestAction.load(PublicRequestKeys.Branches, {
        url: url.href,        
      }));
    }
  }

  componentWillUnmount () {
    const {
      dispatch,
      branches,
    } = this.props;

    if (branches.status === RequestStatus.Loaded) {
      dispatch(requestAction.clear(PublicRequestKeys.Branches));
    }
  }

  render () {
    const {
      branches,
      page,
    } = this.props;
    
    const result = this.props.branches.result;
    
    return (
      <>
        {branches.status === RequestStatus.Loaded && result && (
          <Container fluid={true} className="p-md-0">
            <Row className="m-md-0 p-md-0">
              <Col md={12} className="p-md-0 m-md-0">
                {page && page.result && result.map((item, index) => {
                  return (item && (
                    <BranchItem
                      {...item}
                      index={index} 
                      key={`relevant_branch_item_${item.id}_${index}`} 
                      page={page.result}
                    />
                  )) || null;
                })}
              </Col>
            </Row>
          </Container>
        )}
      </>
    );
  }
};

export const BranchListComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Branches]: state[PublicRequestKeys.Branches],
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
}))(withConfig(BranchListComponentBase));

export default BranchListComponent;
