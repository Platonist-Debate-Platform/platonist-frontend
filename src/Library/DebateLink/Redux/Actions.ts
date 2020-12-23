import { StandardActionFn } from '../../Alerts';
import { Debate } from '../../Models';
import { DebateLinkActionKeys } from './Keys';

export const clearDebateLink: StandardActionFn<
DebateLinkActionKeys.Clear,
undefined,
undefined
> = () => ({
  type: DebateLinkActionKeys.Clear,
  payload: undefined,
});

export const setDebateLink: StandardActionFn<
  DebateLinkActionKeys.Set,
  Debate,
  undefined
> = (payload: Debate) => ({
  type: DebateLinkActionKeys.Set,
  payload,
});


export const createDebateLinkAction = () => ({
  clearDebateLink,
  setDebateLink,
});

export const debateLinkAction = createDebateLinkAction();