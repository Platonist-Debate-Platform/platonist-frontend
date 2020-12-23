import { stringify } from 'querystring';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { usePrevious } from 'react-use';
import { Card, CardBody, CardSubtitle, Col, Row } from 'reactstrap';

import { Comment, Debate, GlobalState, PrivateRequestKeys, PublicRequestKeys, User } from '../../../Library';
import { CommentForm } from './CommentForm';
import { DismissButton } from './DismissButton';

export interface CommentListItemProps extends Comment {
  canWrite: boolean;
  debateId: Debate['id'];
  onSubmit?: () => void; 
}

export const CommentListItem: FunctionComponent<CommentListItemProps> = (props) => {
  const {
    onSubmit,
  } = props;

  const author = props.user as User;

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(
    state => state[PrivateRequestKeys.User]
  );

  const {
    location,
  } = useSelector<GlobalState, GlobalState[PublicRequestKeys.Router]>(
    state => state[PublicRequestKeys.Router]
  );

  const prevLocation = usePrevious(location);

  const searchQuery = '?' + stringify({
    edit: 'comment',
    id: props.id
  });

  const [canWrite, setCanWrite] = useState(props.canWrite && user.result?.id === author?.id);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const createdAt = new Date(props.created_at).toUTCString();
  const updatedAt = new Date(props.updated_at).toUTCString();

  const handleSuccess = useCallback(() => {
    if (!shouldRedirect) {
      setShouldRedirect(true);
    }
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit, shouldRedirect]);


  useEffect(() => {
    if (canWrite !== (props.canWrite && user.result?.id === author?.id)) {
      setCanWrite(!canWrite);
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [author?.id, canWrite, location.search, prevLocation?.search, props.canWrite, searchQuery, shouldRedirect, user.result?.id]);
  
  return (
    <div className="comment-list-item">
      <Row>
        <Col>
          <Card>
            <CardBody>
            <CardSubtitle>
              <small>
                {author && (
                  <Link to={`/user/${user.result?.id === author?.id ? 'me' : author.id}`}>
                    {user.result?.id === author?.id ? 'You' : (
                      <>{author.username}</>
                    )}
                  </Link>
                )} <span>
                  commented <i><TimeAgo date={props.created_at} /></i> {createdAt !== updatedAt && (
                  <>
                    and edited this debate <i><TimeAgo date={props.updated_at} /></i>.
                  </>
                )} </span>
              </small>
              </CardSubtitle>
              <div className={'card-text'}>
                {location.search !== searchQuery ? (
                  <p>{props.comment}</p>
                ) : (
                  <>
                    <DismissButton
                      isBtn={false}
                      pathname={location.pathname}
                      title="Cancel"
                    />
                    <CommentForm 
                      commentId={props.id}
                      debateId={props.debateId}
                      defaultData={{comment: props.comment}}
                      dismissElement={
                        <DismissButton
                          className="btn-sm mr-3"
                          isBtn={true}
                          pathname={location.pathname}
                          title="Cancel"
                        />
                      }
                      onSuccess={handleSuccess}
                      reset={false}
                    />
                  </>
                )}
              </div>
              <div className="comment-list-item-settings">
                {canWrite && location.search !== searchQuery && (
                  <Link to={location.pathname + searchQuery} className="p-0 btn btn-none btn-sm">
                    <i className="fa fa-edit" /> Edit
                  </Link>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {shouldRedirect && (
        <Redirect to={location.pathname} />
      )}
    </div>
  );
};