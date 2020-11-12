import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Collapse, Row } from 'reactstrap';

import { Job, Page } from '../../../../Library';
import {JobInformation} from './JobInformation';

interface JobListLatestItemProps {
  index: number;
  isOpen: boolean;
  job: Job;
  page: Page;
  toggle?: (index: number, state: boolean) => void;
}

const JobListLatestItem: React.FunctionComponent<JobListLatestItemProps> = (props) => {
  const {
    job,
    page,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const toggle = () => {
    setIsOpen(!isOpen);
    if (props.toggle) {
      props.toggle(props.index, !isOpen);
    }
  };

  useEffect(() => {
    if (props.isOpen !== isOpen) {
      setIsOpen(props.isOpen);
    }
  }, [
    props.isOpen,
    isOpen
  ]);

  return (
    <div className="job-latest-item">
      <div 
        className={classNames('job-latest-btn', {
          'active': isOpen,
        })}
        onClick={toggle}
        tabIndex={1}
      >
        {job.name} <i className="icon icon-arrow-right" />
      </div>
      <Collapse isOpen={isOpen}>
        <div className="job-latest-content">
          <Row>
            <Col md={8} sm={12}>
              <p className="lead mb-5">
                {job.lead}
              </p>

              <JobInformation {...job} />
              <Link
                className="btn btn-blue btn-ghost"
                to={encodeURI(`${page.title}/${job.title}`)}
              >
                Details ansehen
              </Link>
            </Col>
          </Row>
        </div>
      </Collapse>
    </div>
  );
};

export default JobListLatestItem;
