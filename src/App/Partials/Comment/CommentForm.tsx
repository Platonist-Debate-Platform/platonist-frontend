import classNames from 'classnames';
import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'react-use';
import { Form } from 'reactstrap';

import {
  Comment,
  Debate,
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
  GlobalState,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '../../../Library';
import { SubmitButton, Text } from '../../../Library/Form/Fields';
import { useAuthentication } from '../../Hooks';

const commentFormData: FormDataConfig<Partial<Comment>>[] =[{
  editable: true,
  key: 'comment',
  required: true,
  title: 'Create a new comment',
  type: FormInputTypes.Text,
  validate: FormValidationTypes.Words,
}];

export interface CommentFormProps {
  commentId?: Comment['id'];
  debateId: Debate['id'];
  defaultData?: Partial<Comment>;
  dismissElement?: ReactElement<any, any>;
  onSuccess?: (isNew: boolean) => void;
  reset?: boolean;
}

export const CommentForm: FunctionComponent<CommentFormProps> = ({
  commentId,
  debateId,
  defaultData,
  dismissElement,
  onSuccess,
  reset,
}) => {

  const [isAuthenticated, state] = useAuthentication();
  const comment = useSelector<GlobalState, GlobalState[PrivateRequestKeys.Comment]>(
    state => state[PrivateRequestKeys.Comment]
  );
  
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/comments${commentId ? '/' + commentId : ''}`;

  const prevComment = usePrevious(comment);

  const handleSubmit = (event: FormClickEvent<Partial<Comment>>) => {
    if (!isAuthenticated && !state && !event.submitData.isValid) {
      return;
    }
    
    const data = {
      ...event.submitData.data,
      debate: debateId,
      user: state?.id,
      created_by: state?.id,
      updated_by: state?.id,
    };
    
    dispatch(requestAction.load(PrivateRequestKeys.Comment, {
      data,
      method: defaultData ? 'put' : 'post',
      url: url.href,
      withCredentials: state?.status === 'Authenticated',
    }));
  }

  useEffect(() => {
    if (
      prevComment?.status === RequestStatus.Updating && 
      comment.status === RequestStatus.Loaded && 
      comment.result
    ) {
      dispatch(requestAction.clear(PrivateRequestKeys.Comment));

      if (onSuccess) {
        onSuccess(!defaultData && !commentId);
      }
    }
  }, [comment.result, comment.status, commentId, defaultData, dispatch, onSuccess, prevComment?.status]);


  return (isAuthenticated && (
    <FormProvider
      data={defaultData || {comment: ''}} 
      inputConfig={commentFormData}
      reset={reset}
    >
      <Form>
        <Text 
          inputKey="comment"
          hideLabel={defaultData ? true : false}
        />
        <div className="text-right">
          {dismissElement && (
            <>{dismissElement}</>
          )}
          <SubmitButton
            className={classNames('btn-success', {
              'btn-sm': defaultData
            })}
            disabled={comment?.status === RequestStatus.Updating} 
            onClick={handleSubmit}
            preventDefault={true}
            type="submit"
          >
            Save Debate <i className="fa fa-cloud-upload-alt" />
          </SubmitButton>
        </div>
      </Form>
    </FormProvider>
  )) || null;
}