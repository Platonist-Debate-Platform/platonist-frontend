import { stringify } from 'qs';
import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious, useUnmount } from 'react-use';
import { Col, Container, Row } from 'reactstrap';

import {
  ApplicationKeys,
  Comment,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  RequestStatus,
  RestMethodKeys,
  RolePermissionTypes,
  RoleState,
  useConfig,
} from '../../../Library';
import {
  useComments,
  useCommentSocket,
  useDebates,
  usePermission,
  useRoles,
} from '../../Hooks';
import { CommentAdd } from './CommentAdd';
import { CommentListItem } from './CommentListItem';

export interface CommentListProps {
  debateId: Debate['id'];
}

export const CommentList: FunctionComponent<CommentListProps> = ({
  debateId,
}) => {
  const {
    state: { result: debate, status: debateStatus },
  } = useDebates<Debate>({
    key: PublicRequestKeys.Debate,
    id: debateId,
    stateOnly: true,
  });

  const config = useConfig();
  const [comment, meta] = useCommentSocket();
  const prevHash = usePrevious(meta.hash);

  const prevComment = usePrevious(comment);

  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(
    (state) => state.user,
  );

  const role = useRoles(
    PrivateRequestKeys.Role,
    user.result?.role?.id,
  ) as RoleState;

  const [canWrite] = usePermission({
    id: user.result?.role?.id,
    methods: [RestMethodKeys.Update, RestMethodKeys.Create],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Comment,
    state: role,
  });

  const query = {
    'debate.id': debateId,
    _sort: 'created_at:DESC',
  };

  const {
    clear,
    load,
    state: { status, result: comments },
    reload,
  } = useComments<Comment[]>({
    key: PublicRequestKeys.Comments,
    search: `?${stringify(query)}`,
  });

  const handleSubmit = useCallback(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const shouldReload = meta.hash !== prevHash && comment ? true : false;

    if (shouldReload && status === RequestStatus.Loaded) {
      reload();
    }
  }, [
    comment,
    status,
    config.api,
    debate,
    debateId,
    debateStatus,
    dispatch,
    prevComment,
    load,
    meta.hash,
    prevHash,
    reload,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded) {
      clear();
    }
  });

  return (
    <div className="comments-list">
      <Container>
        <CommentAdd debateId={debateId} />
        <Row className="mt-3">
          <Col>
            {(comments &&
              comments.length &&
              comments.map((item, index) => (
                <CommentListItem
                  canWrite={canWrite}
                  debateId={debateId}
                  key={`comment_list_item_${item.id}_${index}`}
                  onSubmit={handleSubmit}
                  {...item}
                />
              ))) || <>No Comments yet!</>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
