import "pure-react-carousel/dist/react-carousel.es.css";

import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import Slider, { Settings } from "react-slick";

import {
  CompanyLocationList as CompanyLocationListProps,
  BreakpointTypes,
  Page,
  CompanyLocationItem,
  useConfig,
} from "../../../../Library";

export const CompanyLocationSlideItem: React.FC<
  CompanyLocationItem & { page?: Page | null }
> = (props) => {
  const item = (props as CompanyLocationItem).company_location;
  return (
    <div className="company-location-list-item">
      <i className={`icon icon-${item?.icon}`} />
      <div className="company-location-list-item-text">{item?.city}</div>
      <div className="company-location-list-item-text-description">
        {item?.title}
      </div>
      <div className="company-location-list-item-text-description">
        {item?.street}
      </div>
      <div className="company-location-list-item-text-description">
        {item?.zip}
      </div>
      <div className="company-location-list-item-text-description company-location-list-item-text-phone">
        {item?.phone}
      </div>
      <div className="company-location-list-item-text-description">
        {item?.email}
      </div>
    </div>
  );
};

export const CompanyLocationsList: React.FunctionComponent<CompanyLocationListProps> = (
  props
) => {
  const { items, lead, title } = props;

  const config = useConfig();
  const lg = config.breakpoints.find(
    (breakpoint) => breakpoint.type === BreakpointTypes.Md
  );

  const sorted = items && items.sort((a,b) => {
    return a && a.company_location && a.company_location.ordering && b && b.company_location && b.company_location.ordering && 
    (a?.company_location?.ordering - b?.company_location?.ordering) ? 1:-1;
  });

  const slickSettings: Settings = {
    draggable: true,
    infinite: true,
    slidesToScroll: 3,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: lg?.size || 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="section section-company-location-list">
      <Container fluid={true}>
        <Row>
          <Col className="text-center">
            <h3 className="h2 mb-0">{title}</h3>
            {lead && <p className="lead">{lead}</p>}
          </Col>
        </Row>
        {sorted && sorted.length > 0 && (
          <div className="company-location-list">
            <Row>
              <Col>
                <Slider {...slickSettings}>
                  {sorted.map(
                    (item, index) =>
                      (item && (
                        <CompanyLocationSlideItem
                          {...item}
                          key={`company_location_slide_item_${item.id}_${index}`}
                        />
                      )) ||
                      null
                  )}
                </Slider>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </section>
  );
};

export default CompanyLocationsList;
