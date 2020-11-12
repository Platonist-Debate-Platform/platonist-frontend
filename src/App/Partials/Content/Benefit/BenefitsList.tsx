import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { BenefitList as BenefitsListProps } from "../../../../Library";

export const BenefitsList: React.FunctionComponent<BenefitsListProps> = (
  props
) => {
  const { items, lead, title } = props;

  // const count = 3;
  // const benefits = _chunk(items, count);

  return (
    <section className="section section-benefit-list">
      <Container fluid={true}>
        <Row>
          <Col className="text-center">
            <h3 className="h2 mb-0">{title}</h3>
            {lead && <p className="lead">{lead}</p>}
          </Col>
        </Row>
        {items && items.length > 0 && (
          <div className="benefit-list">
            <Row>
              {items.map(
                (item, index) =>
                  (item && (
                    <Col
                      key={`benefit_list_col_${item.id}_${index}`}
                      md={4}
                      xs={6}
                    >
                      <div className="benefit-list-item">
                        <i className={`icon icon-${item.benefit?.icon}`} />
                        <div className="benefit-list-item-text">
                          {item.benefit?.title}
                        </div>
                      </div>
                    </Col>
                  )) ||
                  null
              )}
            </Row>
            {/* {benefits.map((row, index) => {
              return (row && row.length > 0 && (
                <Row key={`benefit_list_row_${id}_${index}`}>
                  {row.map((item, index) => (item && item.benefit && (
                    <Col key={`benefit_list_col_${item.id}_${index}`} md={12 / count} xs={6}>
                      <div className="benefit-list-item">
                        <i className={`icon icon-${item.benefit.icon}`} />
                      </div>
                    </Col>
                  )) || null)}
                </Row>
              )) || null;
            })} */}
          </div>
        )}
      </Container>
    </section>
  );
};

export default BenefitsList;
