import React, { FunctionComponent } from 'react';
import { Col, Container, Row } from 'reactstrap';

import { DebatePermission } from './Permission';

export const DebateSettings: FunctionComponent = () => {


  return (
    <DebatePermission>
      <div className="debate-settings">
        <Container fluid={true}>
          <Row>
            <Col className="text-right">
              hallo
            </Col>
          </Row>
        </Container>
      </div>
    </DebatePermission>
  );
}