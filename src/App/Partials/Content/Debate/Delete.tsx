import { parse } from 'querystring';
import React, {
  Dispatch,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  alertAction,
  AlertActions,
  AlertTypes,
  Debate,
  GlobalState,
  PublicRequestKeys,
  RequestStatus,
  ToggleType,
} from '../../../../Library';
import { useDebates } from '../../../Hooks';
import { ModalWithRoute } from '../../Modal';
import { cleanParsedSearch, CurrentSearchProps } from './FormEdit';

export interface DebateDeleteProps {
  debate?: Debate;
  from: string;
  to: string;
}

export const DebateDelete: FunctionComponent<DebateDeleteProps> = ({
  debate,
  ...props
}) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const dispatch = useDispatch<Dispatch<AlertActions>>();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const {
    clear,
    data: { status },
    remove,
  } = useDebates({
    key: PublicRequestKeys.Debate,
    id: debate?.id,
    ignoreInitial: true,
  });

  const currentSearch = parse(
    cleanParsedSearch(location.search),
  ) as CurrentSearchProps;

  const handleDelete = useCallback(() => {
    if (status === RequestStatus.Initial) {
      remove();
    }
  }, [remove, status]);

  const handleCancel = useCallback(() => {
    if (!shouldRedirect) {
      setShouldRedirect(true);
    }
  }, [shouldRedirect]);

  useEffect(() => {
    if (status === RequestStatus.Error) {
      clear();
    }
    if (status === RequestStatus.Loaded && !shouldRedirect) {
      setShouldRedirect(true);
      dispatch(
        alertAction.add({
          id: 'delete_debate_success',
          message: 'Debate successfully deleted',
          state: ToggleType.Show,
          type: AlertTypes.Success,
        }),
      );
      clear();
    }
    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [clear, currentSearch, dispatch, location, shouldRedirect, status]);

  if (!debate || Number(currentSearch.id) !== debate?.id) {
    return null;
  }

  return (
    <>
      <ModalWithRoute
        {...props}
        header={'Delete Debate'}
        footer={
          <>
            <button className="btn btn-primary btn-sm" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      >
        You are about to delete the Debate <b>{debate.title}</b>, are you really
        sure about it?
      </ModalWithRoute>
      {shouldRedirect && <Redirect to={props.from} />}
    </>
  );
};
