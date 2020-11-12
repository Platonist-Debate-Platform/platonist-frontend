import React, { useState } from 'react';
import { JobList, RequestStatus, JobsState } from '../../../../Library';
import { Container, Row, Col } from 'reactstrap';
import JobListLatestItem from './JobListLatestItem';

export const JobListLatestContent: React.FC<JobList & {jobs: JobsState}> = ({
  homepage,
  lead,
  page,
  title,
  jobs,
}) => {
  const [active, setActive] = useState<number | undefined>(undefined);
  
  const handleToggle = (index: number, state: boolean) => {
    setActive(state ? index : undefined);
  }
  
  return (
    <section className="section section-job section-job-latest">
      <Container fluid={true}>
        <Row>
          <Col md={6} className="offset-md-3 text-center mb-5">
            <h3 className="h2 mb-0">
              {title}
            </h3>
            {lead && (
              <p className="lead">
                {lead}
              </p>
            )}
          </Col>
        </Row>
        <div className="job job-latest">
          {homepage && (
            <div className="job-latest-item job-latest-title">
              {homepage.title}
            </div>
          )}
          {jobs.status === RequestStatus.Loaded && jobs.result && jobs.result.map((job, index) => 
            (page && <JobListLatestItem
              index={index}
              isOpen={active === index}
              job={job}
              key={`job_list_latest_item_${job.id}_${index}`}
              page={page}
              toggle={handleToggle}
            />
          ) || null)}
        </div>
      </Container>
    </section>
  );
}