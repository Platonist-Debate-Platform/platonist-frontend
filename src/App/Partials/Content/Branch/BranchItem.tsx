import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { Branch, Page } from '../../../../Library';
import { Image } from '../../Image';


export interface BranchItemProps extends Branch {
  index: number;
  page?: Page | null;
}

export interface BranchItemTextProps extends BranchItemProps {
  position: 'left' | 'right';
}

export const BranchItemText: React.FC<BranchItemTextProps> = (props) => (
  <div className={`branches-item-text-${props.position}`}>
    <h3 className="mb-1">
      {props.title}
    </h3>
    {props.lead && (
      <p className="lead">
        {props.previewLead || props.lead}
      </p>
    )}
    {props.page && (
      <Link
        className="btn pl-0" 
        to={encodeURI(`/${props.page.title}/${props.title}`)}>
        Mehr erfahren <i className="icon icon-arrow-right" />
      </Link>
    )}
  </div>
);

export const BranchItem: React.FC<BranchItemProps> = (props) => {
  const {
    index,
  } = props;

  return (
    <div className="branches-item">
      <Row className="align-items-end p-md-0 m-md-0">
        {!(index%2) ? (
          <>
            <Col md={6} className="p-md-0 m-md-0">
              <Image {...props.previewImage} className="branches-item-img" />
            </Col>
            <Col md={6}  className="p-md-0 m-md-0">
              <div className="branches-item-text">
                <BranchItemText {...props} position="right" />
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col md={6} className="p-md-0 m-md-0 order-md-1 order-2">
              <div className="branches-item-text">
                <BranchItemText {...props} position="left" />
              </div>
            </Col>
            <Col md={6} className="p-md-0 m-md-0 order-md-2 order-1">
              <Image {...props.previewImage} className="branches-item-img" />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}

export default BranchItem;