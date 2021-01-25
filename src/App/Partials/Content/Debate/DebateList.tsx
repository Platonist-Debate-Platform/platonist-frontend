import "./DebateList.scss";

import { stringify } from "querystring";
import React, { useEffect } from "react";
import { connect } from "react-redux";

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
import { DebateForm } from "./Form";
import { createSettingsQuery, DebateSettings } from "./Settings";
import { usePrevious } from "react-use";

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

  const query = createSettingsQuery({
    method: RestMethodKeys.Create,
  });

  const searchQuery = stringify(query);
  const linkTo = `${location.pathname}?${searchQuery}`;

  useEffect(() => {
    const shouldLoadInitial = debates && status === RequestStatus.Loaded;

    const shouldReload =
      (debate && debate.id) !== (prevDebate && prevDebate.id);

    if (shouldLoadInitial || shouldReload) {
      // reload();
    }

    return () => {
      if (status === RequestStatus.Loaded) {
        dispatch(requestAction.clear(PublicRequestKeys.Debates));
      }
    };
  }, [config, debates, status, dispatch, page, debate, reload, prevDebate]);

  return (
    <>
      <DebateSettings method={RestMethodKeys.Create} />
      <DebateForm
        from={location.pathname}
        to={linkTo}
        method={RestMethodKeys.Create}
      />
      <section className="section section-debate section-debate-list">
        {status === RequestStatus.Loaded && debates && (
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
  );
};

export const DebateListComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(withConfig(DebateListBase));

export default DebateListComponent;
