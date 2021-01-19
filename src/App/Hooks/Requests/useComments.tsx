import { stringify } from 'querystring';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalState,
  PublicRequestKeys,
  QueryParameter,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
  User,
} from '../../../Library';

export const useComments = (userId?: User['id'], queryParameter: QueryParameter = {
  _sort: 'created_at:DESC',
}) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const comments = useSelector<GlobalState, GlobalState[PublicRequestKeys.Comments]>(state => state[PublicRequestKeys.Comments]);
  const config = useConfig();
  
  useEffect(() => {
    const url = config.createApiUrl(config.api.config);
    url.pathname = (userId && `/comments/by-user/${userId}`) || '';
    url.search = '?' + stringify(queryParameter);

    if (userId && comments.status === RequestStatus.Initial) {
      dispatch(requestAction.load(PublicRequestKeys.Comments, {
        url: url.href,
      }));
    }
  }, [comments.status, config, dispatch, queryParameter, userId]);

  return comments;
};