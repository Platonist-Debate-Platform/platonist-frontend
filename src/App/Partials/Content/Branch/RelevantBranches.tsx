import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { BranchItem as BranchItemProps, RelevantBranches as RelevantBranchesProps } from '../../../../Library';
import { BranchItem } from './BranchItem';

export const RelevantBranches: React.FC<RelevantBranchesProps> = (props) => {
  const {
    lead,
    page,
    relevant,
    title,
  } = props;
  
  return (
    <section className="section section-branches-relevant">
      <div className="branches">
        <div className="branches-relevant-header">
          <Container fluid={true}>
            <Row>
              <Col md={6} className="offset-md-3 text-center">
              <h2 className="mb-1">
                {title}
              </h2>
              {lead && (
                <p className="lead mb-section">
                  {lead}
                </p>
              )}
              </Col>
            </Row>
          </Container>
        </div>
        {relevant && relevant.length > 0 && (
          <div className="branches-relevant-body">
            <Container fluid={true} className="p-md-0">
              <Row className="m-md-0 p-md-0">
                <Col md={12} className="p-md-0 m-md-0">
                  {relevant.map((item, index) => {
                    if (!item) { return null; }
                    
                    const data = (item as BranchItemProps).branch || (item as any).service;          
                    return (
                      <BranchItem
                        {...data}
                        index={index} 
                        key={`relevant_branch_item_${item.id}_${index}`} 
                        page={page}
                      />
                    );
                  })}
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelevantBranches;
