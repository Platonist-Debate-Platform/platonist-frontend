import './DebateList.scss';

import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { usePrevious, useUnmount } from 'react-use';

import {
  Debate,
  DebateList,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  RequestStatus,
  RestMethodKeys,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import { useDebates, useDebateSocket } from '../../../Hooks';
import { DebateListItem } from './DebateListItem';
import { DebateFormEdit } from './FormEdit';
import { DebateSettings } from './Settings';

type DebateListType = DebateList & WithConfigProps;

export interface DebateListProps extends DebateListType {
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export const DebateListBase: React.FunctionComponent<DebateListProps> = ({
  config,
  page,
  path,
  router,
}) => {
  const {
    clear,
    state: { result: debates, status },
    reload,
  } = useDebates<Debate[]>({
    key: PublicRequestKeys.Debates,
    search: '_sort=created_at:DESC',
  });

  const [debate, meta] = useDebateSocket();
  const prevDebate = usePrevious(debate);
  const prevHash = usePrevious(meta.hash);

  const { location } = router;
  const prevLocation = usePrevious(location);

  useEffect(() => {
    const shouldReload = meta.hash !== prevHash && debate ? true : false;

    if (shouldReload && status === RequestStatus.Loaded) {
      reload();
    }
  }, [
    config,
    debates,
    status,
    page,
    debate,
    reload,
    prevDebate,
    location.pathname,
    prevHash,
    meta.hash,
    meta,
    clear,
    path,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded) {
      clear();
    }
  });
  return (
    <>
      <DebateSettings method={RestMethodKeys.Create} />
      <DebateFormEdit debates={debates} from={location.pathname} />
      {status === RequestStatus.Loaded && (
        <>
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
                      null,
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
