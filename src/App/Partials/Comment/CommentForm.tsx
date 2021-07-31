import classNames from 'classnames';
import {
  Comment,
  CommentStatus,
  Debate,
  PrivateRequestKeys,
  RequestStatus,
} from 'platonist-library';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import { Form } from 'reactstrap';

import {
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import { SubmitButton, Text } from '../../../Library/Form/Fields';
import { useAuthentication, useComments } from '../../Hooks';

const commentFormData: FormDataConfig<Partial<Comment>>[] = [
  {
    editable: true,
    key: 'comment',
    required: true,
    title: 'Create a new comment',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Words,
  },
];

export interface CommentFormProps {
  commentId?: Comment['id'];
  debateId: Debate['id'];
  defaultData?: Partial<Comment>;
  dismissElement?: ReactElement<any, any>;
  onSuccess?: (isNew: boolean) => void;
  parent?: Comment['id'];
  reset?: boolean;
}

export const CommentForm: FunctionComponent<CommentFormProps> = ({
  commentId,
  debateId,
  defaultData,
  dismissElement,
  onSuccess,
  parent,
  reset,
}) => {
  const [isAuthenticated, state] = useAuthentication();
  const [shouldReset, setShouldReset] = useState(false);
  const {
    clear,
    send,
    state: { status, result: comment },
  } = useComments<Comment>({
    key: PrivateRequestKeys.Comment,
    stateOnly: true,
  });

  const prevStatus = usePrevious(status);

  const handleSubmit = (event: FormClickEvent<Partial<Comment>>) => {
    if (!isAuthenticated && !state && !event.submitData.isValid) {
      return;
    }

    const data = {
      ...event.submitData.data,
      created_by: state?.id,
      debate: (!parent && debateId) || undefined,
      status: (state?.status as CommentStatus) || CommentStatus.Active,
      updated_by: state?.id,
      user: state?.id,
    };

    if (parent) {
      data.parent = parent;
    }

    send({
      data,
      method: defaultData ? 'PUT' : 'POST',
      pathname: `/comments${commentId ? '/' + commentId : ''}`,
    });
  };

  useEffect(() => {
    if (
      prevStatus === RequestStatus.Updating &&
      status === RequestStatus.Loaded &&
      comment
    ) {
      clear();

      if (!shouldReset) {
        setShouldReset(true);
      }

      if (onSuccess) {
        onSuccess(!defaultData && !commentId);
      }
    }

    if (shouldReset) {
      setShouldReset(false);
    }
  }, [
    clear,
    comment,
    commentId,
    defaultData,
    onSuccess,
    prevStatus,
    shouldReset,
    status,
  ]);

  return (
    (isAuthenticated && (
      <FormProvider
        data={defaultData || { comment: '' }}
        inputConfig={commentFormData}
        reset={shouldReset || reset}
      >
        <Form>
          <Text inputKey="comment" hideLabel={defaultData ? true : false} />
          <div className="text-right">
            {dismissElement && <>{dismissElement}</>}
            <SubmitButton
              className={classNames('btn-success', {
                'btn-sm': defaultData,
              })}
              disabled={status === RequestStatus.Updating}
              onClick={handleSubmit}
              preventDefault={true}
              type="submit"
            >
              Save Comment <i className="fa fa-cloud-upload-alt" />
            </SubmitButton>
          </div>
        </Form>
      </FormProvider>
    )) ||
    null
  );
};
