import React, { FunctionComponent } from 'react';
import { match as Match } from 'react-router-dom';

import { Debate, PublicRequestKeys } from 'platonist-library';
import { useComments } from '../../Hooks';

export interface CommentRouteProps {
  debateId: Debate['id'];
  match: Match<{ commentId?: string }>;
}

export const CommentRoute: FunctionComponent<CommentRouteProps> = ({
  debateId,
  match,
}) => {
  const {
    state: { result: comments },
  } = useComments({
    key: PublicRequestKeys.Comments,
    query: {
      id: match?.params?.commentId,
      'debate.id': debateId,
      _sort: 'created_at:DESC',
    },
  });

  console.log(match);

  console.log(comments);

  return <></>;
};
