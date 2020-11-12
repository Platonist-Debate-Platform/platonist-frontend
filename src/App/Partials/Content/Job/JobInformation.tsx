import React from 'react';

import { Job } from '../../../../Library';
import { Row, Col } from 'reactstrap';

export const JobInformation: React.FunctionComponent<Job> = ({
  contact,
  name,
  location,
  startDate,
}) => {
  const currentTime = new Date().getTime();
  const startTime = startDate ? new Date(startDate).getTime() : currentTime;
  const inPast = startTime <= currentTime;
  const email = (contact && contact.email) || 'recruiting@globalct.com'; 
  return (
    <div className="section-detail-job-info mt-3">
      <Row>
        <Col md={6}>
          <dl>
            <dt>
              Position:
            </dt>
            <dd>
              {name}
            </dd>
            {location && (
              <>
                <dt>
                  Einsatzort:
                </dt>
                <dd>
                  {location}
                </dd>
              </>
            )}
            {startTime && (
              <>
                <dt>
                  Start:
                </dt>
                <dd>
                  {inPast ? 'Ab sofort' : startTime}
                </dd>
              </>
            )}
          </dl>
        </Col>
        {contact && (
          <Col md={4} className="offset-md-2" >
            <dl>
              <dt>
                Ansprechpartner:
              </dt>
              <dd>
                {contact.firstName} {contact.lastName}
              </dd>
              <dt>
                E-Mail:
              </dt>
              <dd>
                <a href={`mailto:${email}`} title={`schreibe an ${email}`}>{email}</a> 
              </dd>
              <dt>
                Telefon:
              </dt>
              <dd>
                <a href={`tel:${contact.phone}`} title={`Telefon ${contact.phone}`}>{contact.phone}</a> 
              </dd>
            </dl>
          </Col>
        )}        
      </Row>
    </div>
  );
};

export default JobInformation;
