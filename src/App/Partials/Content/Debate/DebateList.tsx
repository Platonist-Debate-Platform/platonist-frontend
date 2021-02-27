import './DebateList.scss';

import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { usePrevious, useUnmount } from 'react-use';

import {
  Debate,
  DebateList,
  GlobalState,
  PublicRequestKeys,
  QueryParameterBase,
  ReactReduxRequestDispatch,
  RequestStatus,
  RequestWithPager,
  RestMethodKeys,
  ScrollPager,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import { useDebates, useDebateSocket } from '../../../Hooks';
import { DebateListItem } from './DebateListItem';
import { DebateFormEdit } from './FormEdit';
import { DebateSettings } from './Settings';
import { isEqual } from 'lodash';

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
  const query: QueryParameterBase = {
    _sort: 'created_at:DESC',
    _start: 0,
    _limit: 2,
  };

  const {
    clear,
    send,
    state: { result, status },
    reload,
  } = useDebates<RequestWithPager<Debate[]>>({
    key: PublicRequestKeys.Debates,
    query,
  });

  const debates = result && result.value;

  const [debate, meta, clearSocket] = useDebateSocket();

  const prevDebate = usePrevious(debate);
  const prevHash = usePrevious(meta.hash);

  const { location } = router;

  const handleReach = useCallback(
    (q: QueryParameterBase) => {
      const nextStart = q._start || 0;
      if ((result?.next?.start || 0) <= nextStart) {
        console.log('go');
      }
    },
    [result?.next?.start],
  );

  useEffect(() => {
    const shouldReload = meta.hash !== prevHash && !isEqual(debate, prevDebate);

    if (shouldReload && status === RequestStatus.Loaded) {
      reload();
      clearSocket();
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
    clearSocket,
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
              <ScrollPager
                useWindow={true}
                query={query}
                count={result?.count || 0}
                onReach={handleReach}
              >
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
              </ScrollPager>
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
