import "./DebateList.scss";

import { stringify } from "querystring";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { usePrevious } from "react-use";

import {
  DebateList,
  DebatesState,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  RestMethodKeys,
  withConfig,
  WithConfigProps,
} from "../../../../Library";
import { useDebates, useDebateSocket } from "../../../Hooks";
import { DebateListItem } from "./DebateListItem";
import { DebateFormEdit } from "./FormEdit";
import { createSettingsQuery, DebateSettings } from "./Settings";

type DebateListType = DebateList & WithConfigProps;

export interface DebateListProps extends DebateListType {
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export const DebateListBase: React.FunctionComponent<DebateListProps> = ({
  config,
  dispatch,
  page,
  router,
}) => {
  const {
    data: { result: debates, status },
    reload,
  } = useDebates<DebatesState>(
    PublicRequestKeys.Debates,
    undefined,
    "_sort=created_at:DESC"
  );

  const debate = useDebateSocket();
  const prevDebate = usePrevious(debate);

  const { location } = router;
  const prevLocation = usePrevious(location);

  const query = createSettingsQuery({
    method: RestMethodKeys.Create,
  });

  const searchQuery = stringify(query);
  const linkTo = `${location.pathname}?${searchQuery}`;

  useEffect(() => {
    const shouldReload =
      debate && (debate && debate.id) !== (prevDebate && prevDebate.id)
        ? true
        : false;

    if (shouldReload) {
      reload();
    }

    return () => {
      if (
        status === RequestStatus.Loaded &&
        location.pathname !== prevLocation?.pathname
      ) {
        dispatch(requestAction.clear(PublicRequestKeys.Debates));
      }
    };
  }, [
    config,
    debates,
    status,
    dispatch,
    page,
    debate,
    reload,
    prevDebate,
    location.pathname,
    prevLocation?.pathname,
  ]);

  return (
    <>
      <DebateSettings method={RestMethodKeys.Create} />
      {status === RequestStatus.Loaded && (
        <>
          {/* <DebateForm
            from={location.pathname}
            to={linkTo}
            method={RestMethodKeys.Create}
          /> */}
          <DebateFormEdit debates={debates} from={location.pathname} />
          <section className="section section-debate section-debate-list">
            {debates && (
              <>
                {debates &&
                  debates.length &&
                  debates.map(
                    (debate, index) =>
                      (page.result && debate && (
                        <DebateListItem
                          key={`debate_list_item_${debate.id}_${index}`}
                          pageTitle={page.result.title}
                          {...debate}
                        />
                      )) ||
                      null
                  )}
              </>
            )}
          </section>
        </>
      )}
    </>
  );
};

export const DebateListComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(withConfig(DebateListBase));

export default DebateListComponent;
