import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DebatesState,
  DebateState,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from "../../../Library";
import { useAuthentication } from "./useAuthentication";
import { UseRequestSendProps } from "./useUser";

export const useDebates = <R extends DebateState | DebatesState>(
  key: PublicRequestKeys.Debate | PublicRequestKeys.Debates,
  id?: number
) => {
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const [isAuthenticated, state] = useAuthentication();

  const requestState = useSelector<GlobalState, GlobalState[typeof key]>(
    (state) => state[key]
  );

  const url = config.createApiUrl(config.api.config);
  url.pathname = `/debates${(id && "/" + id) || ""}`;

  const send = ({ data, method, pathname, search }: UseRequestSendProps<R>) => {
    let sendUrl: URL | undefined;

    if (pathname) {
      sendUrl = config.createApiUrl(config.api.config);
      sendUrl.pathname = pathname;
      sendUrl.search = search || "";
    }

    dispatch(
      requestAction.update(key, {
        method,
        url: sendUrl?.href || url.href,
        data,
        withCredentials: true,
      })
    );
  };

  const clear = () => {
    dispatch(requestAction.clear(key));
  };

  useEffect(() => {
    if (key === PublicRequestKeys.Debate && !id) {
      return;
    }
    if (requestState.status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(key, {
          method: "GET",
          url: url.href,
          withCredentials: true,
        })
      );
    }
  }, [
    dispatch,
    isAuthenticated,
    key,
    requestState,
    url.href,
    state?.status,
    id,
  ]);

  return {
    clear,
    data: requestState as R,
    send,
  };
};

export default useDebates;
