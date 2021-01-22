import './DebateList.scss';

import { stringify } from 'querystring';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  DebateList,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  withConfig,
  WithConfigProps,
} from '../../../../Library';
import { DebateListItem } from './DebateListItem';
import { DebateSettings } from './Settings';

type DebateListType = DebateList & WithConfigProps;

export interface DebateListProps extends DebateListType {
  [PublicRequestKeys.Debates]: GlobalState[PublicRequestKeys.Debates];
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export const DebateListBase: React.FunctionComponent<DebateListProps> = ({
  config,
  debates,
  dispatch,
  page,
}) => {

  useEffect(() => {
    if (debates.status === RequestStatus.Initial && config) {
      const url = config.api.createApiUrl(config.api.config);
      url.pathname = 'debates';

      url.search = `?${stringify({
        'page.id': page && page.result?.id,
        _sort: 'created_at:DESC'
      })}`;
      
      dispatch(
        requestAction.load(PublicRequestKeys.Debates, {
          url: url.href,
        })
      );
    }
    return () => {
      if (debates.status === RequestStatus.Loaded) {
        dispatch(requestAction.clear(PublicRequestKeys.Debates));
      }
    }
  }, [
    config, 
    debates,
    debates.status, 
    dispatch, 
    page
  ]);

  return (
    <>
      <DebateSettings />
      <section className="section section-debate section-debate-list">
        {debates.status === RequestStatus.Loaded && debates.result && (
          <>
            {debates.result && debates.result.length && debates.result.map((debate, index) => (page.result && debate && (
              <DebateListItem 
                key={`debate_list_item_${debate.id}_${index}`} 
                pageTitle={page.result.title}
                {...debate}
              />
            )) || null)}
          </>
        )}
      </section>
    </>
  );
}

export const DebateListComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Debates]: state[PublicRequestKeys.Debates],
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
}))(withConfig(DebateListBase));

export default DebateListComponent;
