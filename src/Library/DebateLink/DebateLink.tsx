import React, {
  FunctionComponent,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, LinkProps } from 'react-router-dom';

import { Debate } from '../Models';
import { GlobalState, PublicRequestKeys } from '../Redux';
import { DebateLinkDispatch, setDebateLink } from './Redux';

export interface DebateLinkProps extends LinkProps {
  debate: Debate;
}

export const DebateLink: FunctionComponent<DebateLinkProps> = ({
  children,
  debate,
  to,
  onClick,
  ...rest
}) => {

  const debateLinkState = useSelector<
    GlobalState, 
    GlobalState[PublicRequestKeys.DebateLink]
  >(state => state[PublicRequestKeys.DebateLink]);

  const dispatch = useDispatch<DebateLinkDispatch>();

  const handleClick = useCallback(() => {

    if (!debateLinkState.id && !debateLinkState.debate && to) {
      dispatch(setDebateLink(debate));
    }
  }, [
    debate,
    debateLinkState.debate,
    debateLinkState.id,
    dispatch,
    to,
  ]);

  return (
    <Link {...rest} to={to || ''} onClick={handleClick}>
      {children}
    </Link>
  );
}