import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  ReactReduxRequestState,
  requestAction,
  RequestStatus,
  useConfig,
} from '../../../Library';
import { UseRequestSendProps } from './useUser';

export interface UseRequestBaseProps {
  id?: number;
  stateOnly?: boolean;
  key: PublicRequestKeys | PrivateRequestKeys;
  search?: string;
}

export interface RequestSendProps<Data extends Object> {
  data?: Partial<Data>;
  method: 'GET' | 'POST' | 'PUT';
  pathname?: string;
  search?: string;
  headers?: { [key: string]: string };
}

export interface UseRequestProps extends UseRequestBaseProps {
  path: string;
}

export const useRequest = <Model>({
  id,
  stateOnly,
  key,
  path,
  search,
}: UseRequestProps) => {
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const requestState = useSelector<
    GlobalState,
    ReactReduxRequestState<Model, AxiosRequestConfig>
  >((state) => state[key] as ReactReduxRequestState<Model, AxiosRequestConfig>);

  const url = config.createApiUrl(config.api.config);
  url.pathname = `${path}${(id && '/' + id) || ''}`;
  url.search = search || '';

  const send = ({
    data,
    method,
    pathname,
    search,
  }: RequestSendProps<Model>) => {
    let sendUrl: URL | undefined;

    if (pathname) {
      sendUrl = config.createApiUrl(config.api.config);
      sendUrl.pathname = pathname;
      sendUrl.search = search || '';
    }

    dispatch(
      requestAction.update(key, {
        method,
        url: sendUrl?.href || url.href,
        data,
        withCredentials: true,
      }),
    );
  };

  const clear = () => {
    dispatch(requestAction.clear(key));
  };

  const remove = () => {
    if (!id) {
      return;
    }
    dispatch(
      requestAction.load(key, {
        method: 'delete',
        url: url.href,
        withCredentials: true,
      }),
    );
  };

  const reload = () => {
    if (requestState.status === RequestStatus.Loaded) {
      dispatch(
        requestAction.update(key, {
          method: 'GET',
          url: url.href,
          withCredentials: true,
        }),
      );
    }
  };

  const load = useCallback(() => {
    if (requestState.status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(key, {
          method: 'GET',
          url: url.href,
          withCredentials: true,
        }),
      );
    }
  }, [dispatch, key, requestState.status, url.href]);

  useEffect(() => {
    if (stateOnly) {
      return;
    }
    load();
  }, [stateOnly, load]);

  return {
    clear,
    load,
    state: requestState as ReactReduxRequestState<Model, AxiosRequestConfig>,
    reload,
    remove,
    send,
  };
};

export default useRequest;
