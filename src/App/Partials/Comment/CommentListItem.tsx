import { stringify } from 'querystring';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { usePrevious } from 'react-use';
import { Badge, Card, CardBody, CardSubtitle, Col, Row } from 'reactstrap';

import {
  Comment,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  User,
} from '../../../Library';

import { CommentForm } from './CommentForm';
import { CommentReplies } from './CommentReplies';
import { DismissButton } from './DismissButton';

export interface CommentListItemProps extends Comment {
  canWrite: boolean;
  debateId: Debate['id'];
  isReply?: boolean;
  onSubmit?: () => void;
}

export const CommentListItem: FunctionComponent<CommentListItemProps> = (
  props,
) => {
  const { onSubmit } = props;

  const author = props.user as User;

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(
    (state) => state[PrivateRequestKeys.User],
  );

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  console.log(props);

  const editQuery =
    '?' +
    stringify({
      edit: 'comment',
      id: props.id,
    });

  const replyQuery =
    '?' +
    stringify({
      edit: 'reply',
      id: props.id,
    });

  const viewReplyQuery =
    '?' +
    stringify({
      view: 'replies',
      id: props.id,
    });

  const [canWrite, setCanWrite] = useState(
    props.canWrite && user.result?.id === author?.id,
  );
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
    if (props.isReply) {
      return;
    }
    if (canWrite !== (props.canWrite && user.result?.id === author?.id)) {
      setCanWrite(!canWrite);
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [
    author?.id,
    canWrite,
    location.search,
    props.canWrite,
    editQuery,
    shouldRedirect,
    user.result?.id,
    props.isReply,
  ]);

  return (
    <div className="comment-list-item">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardSubtitle>
                <small>
                  {author && (
                    <Link
                      to={`/user/${
                        user.result?.id === author?.id ? 'me' : author.id
                      }`}
                    >
                      {user.result?.id === author?.id ? (
                        'You'
                      ) : (
                        <>{author.username}</>
                      )}
                    </Link>
                  )}{' '}
                  <span>
                    commented{' '}
                    <i>
                      <TimeAgo date={props.created_at} />
                    </i>{' '}
                    {createdAt !== updatedAt && (
                      <>
                        and edited this debate{' '}
                        <i>
                          <TimeAgo date={props.updated_at} />
                        </i>
                        .
                      </>
                    )}{' '}
                  </span>
                </small>
              </CardSubtitle>
              <div className={'card-text'}>
                {location.search !== editQuery ? (
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
                      defaultData={{ comment: props.comment }}
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
                <Row>
                  <Col>
                    <Link
                      to={
                        location.pathname + location.search ===
                        location.pathname + viewReplyQuery
                          ? location.pathname
                          : location.pathname + viewReplyQuery
                      }
                      className="p-0 mr-3 btn btn-none btn-sm"
                      title="Show relies"
                    >
                      <Badge>{props.replyCount}</Badge> Replies{' '}
                      <i className="fa fa-chevron-right" />
                    </Link>
                  </Col>
                  <Col className="text-right">
                    {canWrite && (
                      <>
                        <Link
                          to={location.pathname + replyQuery}
                          className="p-0 mr-3 btn btn-none btn-sm"
                        >
                          <i className="fa fa-reply" /> Reply
                        </Link>
                        {location.search !== editQuery && (
                          <Link
                            to={location.pathname + editQuery}
                            className="p-0 btn btn-none btn-sm"
                          >
                            <i className="fa fa-edit" /> Edit
                          </Link>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              </div>
              {!props.isReply && (
                <>
                  {canWrite && (
                    <CommentReplies
                      canWrite={canWrite}
                      from={location.pathname}
                      isForForm={true}
                      parent={props.id}
                      to={location.pathname + replyQuery}
                    />
                  )}

                  <CommentReplies
                    canWrite={canWrite}
                    from={location.pathname}
                    parent={props.id}
                    to={location.pathname + viewReplyQuery}
                  />
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {shouldRedirect && <Redirect to={location.pathname} />}
    </div>
  );
};
