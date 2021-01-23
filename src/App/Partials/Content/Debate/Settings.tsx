import React, { FunctionComponent } from 'react';
import { Col, Container, Row } from 'reactstrap';

import { RestMethodKeys } from '../../../../Library';
import { DebatePermission } from './Permission';

export interface DebateSettingsProps {
  method: RestMethodKeys;
}

export const DebateSettings: FunctionComponent<DebateSettingsProps> = ({
  method
}) => {

  return (
    <DebatePermission method={method}>
      {method === RestMethodKeys.Create && (
        <div className="debate-settings">
          <Container fluid={true}>
            <Row>
              <Col className="text-right">
                hallo
              </Col>
            </Row>
          </Container>
        </div>
      )}  
    </DebatePermission>
  );
}