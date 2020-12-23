import React, { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';
import { Badge, Col, Container, Row } from 'reactstrap';
import { Debate, DebateLink } from '../../../../Library';
import { ArticleItem } from '../../Article';

export interface DebateListItemProps extends Debate {
  pageTitle: string;
}

export const DebateListItem: FunctionComponent<DebateListItemProps> = ({
  pageTitle,
  ...debate
}) => {
  const {
    articleA,
    articleB,
    comments,
    created_at,
    subTitle,
    title,
  } = debate;

  const href = encodeURI(`/${pageTitle}/${debate.title}`);
  return (
    <div className="debate-list-item">
      <Container>
        <Row>
          <Col md={8}>
            <small>
              <FormattedDate 
                value={created_at} 
                day="numeric"
                month="long"
                year="numeric"
              />
            </small>
            <h4 className="mb-3">
              <DebateLink 
                debate={debate}
                to={href}
              >
                {title} <small>{subTitle}</small>
              </DebateLink>
            </h4>
          </Col>
          <Col className="text-right" md={4}>
            <small>
              Comments <Badge>{comments?.length || 0}</Badge>
            </small>
          </Col>
          <Col md={6}>
            {articleA && (
              <ArticleItem {...articleA} />
            )}
          </Col>
          <Col md={6}>
            {articleB && (
              <ArticleItem {...articleB} />
            )}
          </Col>
          <Col className="text-right" md={12}>
            <DebateLink 
              className="btn btn-primary"
              debate={debate}
              to={href}
            >
              Debate now <i className="fa fa-comments" />
            </DebateLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
}