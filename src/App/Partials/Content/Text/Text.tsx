import classNames from 'classnames';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'reactstrap';

import { assetRenderer, Text as TextComponentProps } from '../../../../Library';

export const TextComponent: React.FunctionComponent<TextComponentProps & {forJobs?: boolean}> = ({
  __component,
  active,
  content,
  forJobs,
  isFluid,
}) => {
  
  if (!active) {
    return null;
  }

  const className = __component.replace(/\./g, '-').toLowerCase();
  
  return (
    <div className={className}>
      <div 
        className={classNames({
          'container': !forJobs && !isFluid,
          'container-fluid': !forJobs && isFluid,
        })
      }>
        <Row>
          <Col md={!forJobs ? 10 : 12} className={classNames({'offset-md-1': !forJobs})} >
            <ReactMarkdown 
              source={content}
              renderers={{
                image: assetRenderer,
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TextComponent;
