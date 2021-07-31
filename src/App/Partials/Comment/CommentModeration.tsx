import {
  Comment,
  CommentStatus,
  PrivateRequestKeys,
  RequestMethod,
  RequestStatus,
} from 'platonist-library';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useUnmount } from 'react-use';
import {
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import {
  Checkbox,
  Select,
  SubmitButton,
  Text,
} from '../../../Library/Form/Fields';
import { useComments } from '../../Hooks';
import { ModalWithRoute, ModalWithRouteProps } from '../Modal';

interface CommentModerationProps {
  from: ModalWithRouteProps['from'];
  to: ModalWithRouteProps['to'];
  commentId: Comment['id'];
}

interface ModerationFormProps {
  status: CommentStatus;
  blocked: boolean;
  disputed: boolean;
  moderationComment: string;
}

const commentFormData: FormDataConfig<Partial<ModerationFormProps>>[] = [
  {
    editable: true,
    key: 'blocked',
    required: false,
    title: 'Block comment',
    type: FormInputTypes.Checkbox,
  },
  {
    editable: true,
    key: 'disputed',
    required: false,
    title: 'Dispute comment',
    type: FormInputTypes.Checkbox,
  },
  {
    editable: true,
    key: 'status',
    required: true,
    title: 'Set comment Status',
    type: FormInputTypes.Select,
    selectValues: [
      CommentStatus.Active,
      CommentStatus.Blocked,
      CommentStatus.Disputed,
    ],
  },
  {
    editable: true,
    key: 'moderationComment',
    required: false,
    title: 'Reason for disputing or blocking this Comment',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Words,
  },
];

const ModerationModalHeader = () => <>Moderate Comment</>;

export const CommentModeration: FunctionComponent<CommentModerationProps> = ({
  commentId,
  from,
  to,
}) => {
  const [formData, setFormData] =
    useState<Partial<ModerationFormProps> | undefined>();

  const {
    clear,
    state: { status, result: comment },
    send,
    load,
  } = useComments<Comment>({
    id: Number(commentId),
    key: PrivateRequestKeys.Moderate,
    stateOnly: true,
  });

  const handleClosing = useCallback(() => {
    if (status === RequestStatus.Loaded && comment) {
      clear();
    }
  }, [clear, comment, status]);

  const handleOpening = useCallback(() => {
    if (status === RequestStatus.Initial && !comment) {
      load();
    }
  }, [comment, load, status]);

  const handleSubmit = useCallback(
    ({ submitData }: FormClickEvent<ModerationFormProps>) => {
      if (submitData && submitData.data && submitData.isValid) {
        send({
          method: RequestMethod.Update,
          data: {
            ...submitData.data,
            blocked:
              submitData.data?.blocked.toString() === 'true' ? true : false,
            disputed:
              submitData.data?.disputed.toString() === 'true' ? true : false,
          },
        });
      }
    },
    [send],
  );

  useEffect(() => {
    if (!formData && comment || formData && ) {
      // setFormData({
      //   blocked: comment.blocked || false,
      //   disputed: comment.disputed || false,
      //   status: comment.status || CommentStatus.Active,
      //   moderationComment: comment.moderationComment,
      // });
    }
  }, [comment, formData, load, status]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded && comment) {
      clear();
    }
  });

  return (
    <ModalWithRoute
      from={from}
      header={<ModerationModalHeader />}
      onClosed={handleClosing}
      onOpened={handleOpening}
      size="lg"
      to={to}
    >
      {formData && (
        <FormProvider data={formData} inputConfig={commentFormData}>
          <Checkbox inputKey="blocked" />
          <Checkbox inputKey="disputed" />
          <Select inputKey="status" />
          <Text inputKey="moderationComment" />
          <SubmitButton
            className="btn btn-green btn-small"
            onClick={handleSubmit}
          >
            Save
          </SubmitButton>
        </FormProvider>
      )}
    </ModalWithRoute>
  );
};
