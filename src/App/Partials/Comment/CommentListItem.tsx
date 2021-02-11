import { stringify } from 'qs';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';

import {
  ApplicationKeys,
  Comment,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  RestMethodKeys,
  RolePermissionTypes,
  RoleState,
  User,
} from '../../../Library';
import { usePermission, useRoles, useUser } from '../../Hooks';
import { CommentItem } from './CommentItem';
import { CommentReplies } from './CommentReplies';

export interface CommentListItemProps extends Comment {
  canCreate?: boolean;
  canEdit?: boolean;
  debateId: Debate['id'];
  isReply?: boolean;
  onSubmit?: () => void;
}

export const CommentListItem: FunctionComponent<CommentListItemProps> = ({
  canCreate,
  canEdit,
  debateId,
  isReply,
  onSubmit,
  ...props
}) => {
  const author = props.user as User;

  const {
    user: { result: user },
  } = useUser();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const editQuery =
    '?' +
    stringify({
      edit: 'comment',
      id: props.id,
    });

  const replyQuery = unescape(
    !isReply
      ? '?' +
          stringify({
            edit: 'reply',
            id: props.id,
          })
      : '?' +
          stringify({
            view: 'replies',
            id: (props.parent as Comment | undefined)?.id,
            child: { edit: 'reply', id: props.id },
          }),
  );

  const viewReplyQuery = unescape(
    !isReply
      ? '?' +
          stringify({
            view: 'replies',
            id: props.id,
          })
      : '?' +
          stringify({
            view: 'replies',
            id: (props.parent as Comment | undefined)?.id,
            child: { id: props.id },
          }),
  );

  const [canWrite, setCanWrite] = useState(canEdit && user?.id === author?.id);

  const roleState = useRoles(PrivateRequestKeys.Role, user?.id) as RoleState;

  const [canComment] = usePermission({
    id: user?.role?.id,
    methods: [RestMethodKeys.Create, RestMethodKeys.Update],
    permission: RolePermissionTypes.Application,
    state: roleState,
    type: ApplicationKeys.Comment,
  });

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleSuccess = useCallback(() => {
    if (!shouldRedirect) {
      setShouldRedirect(true);
    }
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit, shouldRedirect]);

  useEffect(() => {
    if (isReply) {
      return;
    }
    if (canWrite !== (canEdit && user?.id === author?.id)) {
      setCanWrite(!canWrite);
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [
    author?.id,
    canWrite,
    location.search,
    canEdit,
    editQuery,
    shouldRedirect,
    user?.id,
    isReply,
  ]);

  return (
    <div className="comment-list-item">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CommentItem
                debateId={debateId}
                editQuery={editQuery}
                handleSuccess={handleSuccess}
                item={props}
                user={user}
              />
              <div className="comment-list-item-settings">
                <Row>
                  <Col>
                    <Link
                      to={
                        (location.pathname + location.search).indexOf(
                          location.pathname + viewReplyQuery,
                        ) > -1
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
                    {canComment && (
                      <Link
                        to={location.pathname + replyQuery}
                        className="p-0 mr-3 btn btn-none btn-sm"
                      >
                        <i className="fa fa-reply" /> Reply
                      </Link>
                    )}
                    {canWrite && location.search !== editQuery && (
                      <Link
                        to={location.pathname + editQuery}
                        className="p-0 btn btn-none btn-sm"
                      >
                        <i className="fa fa-edit" /> Edit
                      </Link>
                    )}
                  </Col>
                </Row>
              </div>
              {!isReply && (
                <>
                  {canComment && (
                    <CommentReplies
                      canComment={canComment}
                      from={location.pathname}
                      isForForm={true}
                      parent={props.id}
                      to={location.pathname + replyQuery}
                    />
                  )}

                  <CommentReplies
                    canComment={canComment}
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
