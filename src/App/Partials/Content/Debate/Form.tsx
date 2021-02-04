import { isEqual } from 'lodash';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Form, Row } from 'reactstrap';

import {
  createDefaultData,
  DebateState,
  FormClickEvent,
  FormContextValue,
  FormDataConfig,
  FormProvider,
  PublicRequestKeys,
  RequestStatus,
  RestMethodKeys,
} from '../../../../Library';
import {
  Group,
  Input,
  SubmitButton,
  Text,
} from '../../../../Library/Form/Fields';
import { useDebates } from '../../../Hooks';
import { ModalWithRoute } from '../../Modal';
import {
  ArticleFetcherOnClear,
  ArticleFetcherOnReceive,
  FormArticleFetcher,
} from './FormArticleFetcher';
import { DebateFormData, debateFormData } from './FormData';
import { DebateSettingsProps } from './Settings';

export interface DebateFormProps extends DebateSettingsProps {
  debateDefault?: Partial<DebateFormData>;
  from: string;
  to: string;
}

const DebateModalHeader: FunctionComponent<{
  method: DebateFormProps['method'];
}> = ({ method }) => {
  switch (method) {
    case RestMethodKeys.Create:
      return <>Create a new Debate</>;
    case RestMethodKeys.Update:
      return <>Edit this Debate</>;
    default:
      return null;
  }
};

const makeInputsEditable = <Data extends Object>(
  configs: FormDataConfig<Data>[],
): FormDataConfig<Data>[] =>
  configs.map((config) => {
    config.editable = true;
    if (config.group) {
      config.group = makeInputsEditable(config.group);
    }
    return config;
  });

export const DebateForm: FunctionComponent<DebateFormProps> = ({
  debateDefault,
  debateId,
  method,
  ...props
}) => {
  const {
    clear,
    data: { result: debate, status },
    send,
  } = useDebates<DebateState>({ key: PublicRequestKeys.Debate });

  const isDeleteMethod = method !== RestMethodKeys.Delete ? true : false;

  const [defaultData, setDefaultData] = useState(
    debateDefault || createDefaultData<Partial<DebateFormData>>(debateFormData),
  );

  const [formData, setFormData] = useState(
    (debateDefault && makeInputsEditable(debateFormData)) || debateFormData,
  );
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [resetForm, setResetForm] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (event: FormClickEvent<Partial<DebateFormData>>) => {
      const { data: submitData, isValid } = event.submitData;

      if (defaultData.articleAUrl) {
        if (submitData.articleA) {
          submitData.articleA.url = defaultData.articleAUrl;
        }
        delete submitData.articleAUrl;
      }

      if (defaultData.articleBUrl) {
        if (submitData.articleB) {
          submitData.articleB.url = defaultData.articleBUrl;
        }
        delete submitData.articleBUrl;
      }

      if (status === RequestStatus.Initial && isValid && submitData) {
        send({
          method: (method === RestMethodKeys.Create && 'POST') || 'PUT',
          data: submitData as any,
          pathname: `debates/${debateId}`,
        });
      }
    },
    [
      debateId,
      defaultData.articleAUrl,
      defaultData.articleBUrl,
      method,
      send,
      status,
    ],
  );

  const handelReceive: ArticleFetcherOnReceive<DebateFormData> = useCallback(
    (key, data) => {
      const newDefaultData = {
        ...defaultData,
        [key]: data,
      };

      const index = debateFormData.findIndex(
        (formData) => formData.key === key,
      );

      const config = index > 0 && formData[index];

      if (config && config.group && config.key === key) {
        config.group.map((conf) => {
          conf.editable = true;
          return conf;
        });

        setFormData((prevFormData) => {
          prevFormData[index] = config;
          return prevFormData;
        });
      }

      setDefaultData(newDefaultData);

      if (!resetForm) {
        setResetForm(true);
      }
    },
    [defaultData, formData, resetForm],
  );

  const handleClear: ArticleFetcherOnClear<DebateFormData> = useCallback(
    (key, [inputValue, setInputValue]) => {
      const index = debateFormData.findIndex(
        (formData) => formData.key === key,
      );

      const config = index > 0 && formData[index];

      if (config && config.group) {
        const defaults = {
          ...defaultData,
          [key]: createDefaultData(config.group),
        };

        setDefaultData(defaults);

        if (inputValue) {
          setInputValue(key, {
            ...inputValue,
            isValid: false,
            pristine: true,
            touched: false,
            disabled: false,
            defaultValue: defaults[key] as any,
            value: defaults[key] as any,
          });
        }

        config.group.map((conf) => {
          conf.editable = false;
          return conf;
        });

        setFormData((prevFormData) => {
          prevFormData[index] = config;
          return prevFormData;
        });
      }
    },
    [defaultData, formData],
  );

  const handleModalClose = useCallback(() => {
    setDefaultData(createDefaultData<Partial<DebateFormData>>(debateFormData));

    if (!resetForm) {
      setResetForm(true);
    }
  }, [resetForm]);

  const handleChange = useCallback(
    (context: FormContextValue<DebateFormData>) => {
      const { submitData } = context;

      if (submitData && !debateDefault) {
        setDefaultData({
          ...defaultData,
          ...submitData.data,
        });
      }
    },
    [debateDefault, defaultData],
  );

  useEffect(() => {
    if (resetForm) {
      setResetForm(false);
      return;
    }

    if (
      (!defaultData && debateDefault) ||
      (debateDefault && defaultData.id !== debateDefault?.id)
    ) {
      setDefaultData(debateDefault);
    }

    if (status === RequestStatus.Error) {
      clear();
    }

    if (status === RequestStatus.Loaded && debate) {
      clear();
      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
      setDefaultData(
        createDefaultData<Partial<DebateFormData>>(debateFormData),
      );
    }

    const dataIsEqual = isEqual(defaultData, debateDefault);

    if (!dataIsEqual) {
      if (debateDefault) {
        setDefaultData(debateDefault);
        setResetForm(true);
      }
    }
  }, [
    clear,
    debate,
    debateDefault,
    defaultData,
    resetForm,
    shouldRedirect,
    status,
  ]);

  return (
    <FormProvider
      data={defaultData}
      inputConfig={formData}
      onChange={handleChange}
      preValidate={true}
      reset={resetForm || shouldRedirect}
    >
      <ModalWithRoute
        {...props}
        footer={
          <SubmitButton
            color="success"
            onClick={handleSubmit}
            disabled={status === RequestStatus.Updating}
          >
            Save
          </SubmitButton>
        }
        header={<DebateModalHeader method={method} />}
        size={isDeleteMethod ? 'xl' : 'sm'}
        onClosed={handleModalClose}
      >
        <Form>
          <Row>
            <Col sm={7}>
              <Input inputKey="title" />
              <Input inputKey="subTitle" />
              <Text inputKey="shortDescription" />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormArticleFetcher
                dataKey="articleA"
                inputKey="articleAUrl"
                onClear={handleClear}
                onReceive={handelReceive}
              />
              <Group inputKey="articleA" />
            </Col>
            <Col sm={6}>
              <FormArticleFetcher
                dataKey="articleB"
                inputKey="articleBUrl"
                onClear={handleClear}
                onReceive={handelReceive}
              />
              <Group inputKey="articleB" />
            </Col>
          </Row>
        </Form>
      </ModalWithRoute>
      {shouldRedirect && <Redirect to={props.from} />}
    </FormProvider>
  );
};
