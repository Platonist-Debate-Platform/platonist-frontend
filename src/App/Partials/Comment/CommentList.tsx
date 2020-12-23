import { stringify } from 'querystring';
import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'react-use';
import { Col, Container, Row } from 'reactstrap';

import {
  ApplicationKeys,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  RestMethodKeys,
  RolePermissionTypes,
  useConfig,
} from '../../../Library';
import { useCommentSocket, usePermission } from '../../Hooks';
import { CommentAdd } from './CommentAdd';
import { CommentListItem } from './CommentListItem';

export interface CommentListProps {
  debateId: Debate['id'];
}

export const CommentList: FunctionComponent<CommentListProps> = ({
  debateId,
}) => {
  const debate = useSelector<
    GlobalState, 
    GlobalState[PublicRequestKeys.Debate]
  >(
    state => state[PublicRequestKeys.Debate]
  );

  const comments = useSelector<
    GlobalState, 
    GlobalState[PublicRequestKeys.Comments]
  >(
    state => state[PublicRequestKeys.Comments]
  );

  const config = useConfig();
  const comment = useCommentSocket();

  const prevComment = usePrevious(comment);

  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(state => state.user);
  
  const [canWrite] = usePermission({
    id: user.result?.role?.id,
    methods: [RestMethodKeys.Update, RestMethodKeys.Create],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Comment,
  });

  const url = config.api.createApiUrl(config.api.config);
  url.pathname = 'comments'

  const query = {
    'debate.id': debate.result?.id,
    _sort: 'created_at:DESC',
  }

  url.search = `?${stringify(query)}`;
  
  const handleSubmit = useCallback(() => {
    dispatch(
      requestAction.update(PublicRequestKeys.Comments, {
        url: url.href,
      })
    );
  }, [dispatch, url.href]);

  useEffect(() => {
    const shouldLoadInitial = debate.result && 
      debate.status === RequestStatus.Loaded && 
      comments.status === RequestStatus.Initial;
    
    const shouldReload = 
      comment && 
      comment.id !== (prevComment && prevComment.id) && 
      (comment.debate as Debate).id === debateId;

    if (shouldLoadInitial || shouldReload) {

      dispatch(
        requestAction.load(PublicRequestKeys.Comments, {
          url: url.href,
        })
      );
    }
  }, [comment, comments.status, config.api, debate.result, debate.status, debateId, dispatch, prevComment, url.href]);

  return (
    <div className="comments-list">
      <Container>
        <CommentAdd debateId={debateId} />
        <Row className="mt-3">
          <Col>
            {(comments.result && comments.result.length && comments.result.map((item, index) => 
              <CommentListItem 
                canWrite={canWrite}
                debateId={debateId}
                key={`comment_list_item_${item.id}_${index}`}
                onSubmit={handleSubmit}
                {...item}
              />
            )) || (<>No Comments yet!</>)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};