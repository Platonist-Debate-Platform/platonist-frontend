import 'pure-react-carousel/dist/react-carousel.es.css';

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';
import { Col, Container, Row } from 'reactstrap';

import {
  BranchItem,
  BreakpointTypes,
  CollapseHover,
  Page,
  ServiceItem,
  ServiceSlider as ServiceSliderProps,
  useConfig,
} from '../../../../Library';
import { Image } from '../../Image';
import MESSAGES from './Service.messages';

export const ServiceSlideItem: React.FC<(ServiceItem | BranchItem) & {page?: Page | null;}> = (props) => {
  const {page} = props;
  const item = (props as ServiceItem).service || (props as BranchItem).branch;

  const linkTo = decodeURI(page ? `/${page.title}/${item.title}` : `/${item.title}`)
  const Lead = (
    <>
      {item.lead && (
        <p>{item.lead}</p>
      )}
    </>
  );  
  
  return (
    <Link to={linkTo} className="service-slider-item" title={item.title}>
      <Image 
        className="service-slider-img"
        {...item.previewImage}
      />
      <CollapseHover collapseChildren={Lead}>
        <>
          <h3>{item.title}</h3>
        </>
      </CollapseHover>
    </Link>
  );
};

export const ServiceSlider: React.FC<ServiceSliderProps> = (props) => {
  const {
    callToAction,
    hidden,
    lead,
    page,
    slides,
    title,
  } = props;

  const config = useConfig();

  const lg = config.breakpoints.find(breakpoint => breakpoint.type === BreakpointTypes.Lg);

  const slickSettings: Settings = {
    draggable: true,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 2,
    responsive: [{
      breakpoint: lg?.size || 1200,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }]
  };
  
  return !hidden ? (
    <section className="service service-slider">
      <Container fluid={true}>
        <Row>
          <Col sm={6} className="offset-sm-3 text-center">
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
      {slides && slides.length > 0 && (
        <div className="service-slider-wrap">
          <Container fluid={true} >
            <Row>
              <Col>
                <Slider {...slickSettings}>
                {slides.map((slide, index) => (slide && 
                    <ServiceSlideItem 
                      {...slide} 
                      page={page} 
                      key={`service_slide_item_${slide.id}_${index}`}
                    />
                  ) || null)}
                </Slider>
              </Col>
            </Row>
          </Container>
        </div>
      )}
      {page && (  
        <Container fluid={true}>
          <Row>
            <Col sm={6} lg={4} className="offset-sm-3 offset-lg-4 text-center">
              <Link
                className="btn btn-green btn-sized" 
                to={`/${encodeURI(page.title)}`}
              >
                {callToAction || (
                  <FormattedMessage {...MESSAGES.toServiceDetail} />
                )}
              </Link>
            </Col>
          </Row>
        </Container>
      )}
    </section>
  ) : null;
}
