import React, { FunctionComponent } from 'react';
import { CollapseWithRoute } from '../Collapse';

export interface CommentRepliesProps {
  from: string;
  to: string;
}

export const CommentReplies: FunctionComponent<CommentRepliesProps> = ({
  ...props
}) => {
  return <CollapseWithRoute {...props}>Hallo Welt</CollapseWithRoute>;
};
