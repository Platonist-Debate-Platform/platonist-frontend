import { ReactReduxRequestErrorMessage, StrapiErrorMessage } from '../../ReactReduxRequest';
import { addAlert, clearAlert, hideAlert, removeAlert, showAlert, toggleAlert } from './Actions';
import { AlertTypes, ToggleType } from './Keys';

export interface StandardAction<ActionType extends string, Payload, Meta extends undefined | Object> {
  type: ActionType,
  meta?: Meta,
  payload: Payload,
}

export interface AlertAddPayload {
  id: string;
  message: string | ReactReduxRequestErrorMessage[] | StrapiErrorMessage[];
  state: ToggleType;
  type: AlertTypes,
}

export interface AlertPayload {
  id: string;
  message: string | ReactReduxRequestErrorMessage[] | StrapiErrorMessage[];
  state?: ToggleType;
  type: AlertTypes,
}

export type StandardActionFn<ActionType extends string, Payload extends undefined | Object, Meta extends undefined | Object> = (
  props: Payload
) => StandardAction<ActionType, Payload, Meta>;

export type AlertActions =
  | ReturnType<typeof addAlert>
  | ReturnType<typeof clearAlert>
  | ReturnType<typeof hideAlert>
  | ReturnType<typeof removeAlert>
  | ReturnType<typeof showAlert>
  | ReturnType<typeof toggleAlert>

export interface AlertDispatch {
  <A extends AlertActions>(action: A): A;
}

export type AlertState = {
  [AlertTypes.Danger]: (AlertPayload | AlertAddPayload)[];
  [AlertTypes.Info]: (AlertPayload | AlertAddPayload)[];
  [AlertTypes.Success]: (AlertPayload | AlertAddPayload)[];
  [AlertTypes.Warning]: (AlertPayload | AlertAddPayload)[];
}