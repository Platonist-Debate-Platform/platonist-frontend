import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { createDefaultData, FormProvider, GlobalState, PrivateRequestKeys, ReactReduxRequestDispatch, requestAction, RequestStatus, RestMethodKeys, useConfig, useInputValue } from '../../../../Library';
import { ModalWithRoute } from '../../Modal';
import { DebateFormData, debateFormData } from './FormData';
import { DebateSettingsProps } from './Settings';
import { Button, Col, Form, FormGroup, Label, Row } from 'reactstrap';
import { Group, GroupBase, Input, Text } from '../../../../Library/Form/Fields';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'react-use';

export interface DebateFormProps extends DebateSettingsProps {
  from: string;
  to: string;
}

const DebateModalHeader: FunctionComponent<{method: DebateFormProps['method']}> = ({
  method
}) => {
  switch (method) {
    case RestMethodKeys.Create:
      return <>Create a new Debate</>
    default:
      return null;
  } 
};

interface ArticleFetcherProps<Data extends Object> {
  inputKey: keyof Data | string;
}

const ArticleFetcher: FunctionComponent<ArticleFetcherProps<DebateFormProps>> = ({
  inputKey
}) => {
  const config = useConfig()
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const [inputValue, setFormValue] = useInputValue<DebateFormProps>(inputKey as keyof DebateFormProps);
  const {
    result: article,
    status
  } = useSelector<GlobalState, GlobalState[PrivateRequestKeys.Article]>(state => state.article);
  console.log(inputValue);
  
  const prevStatus = usePrevious(status);

  const handleUpload = useCallback(() => {
    if (!inputValue) {
      return;
    }

    const url = config.createApiUrl(config.api.config);
    url.pathname = '/articles/fetch-url'

    if (inputValue.isValid && status === RequestStatus.Initial) {
      dispatch(requestAction.load(PrivateRequestKeys.Article, {
        method: 'POST',
        url: url.href,
        withCredentials: true,
        data: {url: inputValue.value},
      }));
    }
  }, [config, dispatch, inputValue, status]);

  const handleClear = useCallback(() => {
    if (!inputValue) {
      return;
    }

    if (status === RequestStatus.Loaded && article && article.title) {
      dispatch(requestAction.clear(PrivateRequestKeys.Article));
      setFormValue(inputKey, {
        ...inputValue,
        isValid: false,
        pristine: true,
        touched: false,
        disabled: false,
        value: '',
      });
    }
  }, [article, dispatch, inputKey, inputValue, setFormValue, status])

  useEffect(() => {
    if (!inputValue) {
      return;
    }

    if (prevStatus === RequestStatus.Updating && status === RequestStatus.Loaded && article && article.title) {
      console.log(article);
      setFormValue(inputKey, {
        ...inputValue,
        disabled: true,
      });
    }

  }, [article, inputKey, inputValue, prevStatus, setFormValue, status]);
  
  if (!inputValue) {
    return null;
  }

  return (
    <Row>
      <Col xs={12}>
        <Label>
          {inputValue.config?.title}
        </Label>
      </Col>
      <Col>
        <Input inputKey={inputKey} hideLabel={true} />
      </Col>
      <Col xs={3}>
        <FormGroup>
          <Button
            size="sm"
            className="w-50"
            disabled={status === RequestStatus.Loaded && article && article.title ? false : true}
            onClick={handleClear}
          >
            <i className="fa fa-times" />
          </Button>
          <Button
            size="sm"
            color="primary"
            className="w-50"
            disabled={!inputValue.isValid || (status === RequestStatus.Loaded && article && article.title) ? true : false}
            onClick={handleUpload}
          >
            <i className="fa fa-eye" />
          </Button>
        </FormGroup>
      </Col>
    </Row>
  );
}
export const DebateForm: FunctionComponent<DebateFormProps> = ({
  method,
  debateId,
  ...props
}) => {
  const isDeleteMethod = method !== RestMethodKeys.Delete ? true : false
  const defaultData = createDefaultData<Partial<DebateFormData>>(debateFormData);
  return (
    <ModalWithRoute
      {...props}
      header={<DebateModalHeader method={method} />}
      size={(isDeleteMethod && 'lg') || 'xl'}
    >
      <FormProvider
        data={defaultData} 
        inputConfig={debateFormData}
      >
        <Form>
          <Input inputKey="title" />
          <Input inputKey="subTitle" />
          <Text inputKey="shortDescription" />

          <ArticleFetcher inputKey="articleAUrl" />
          <Group inputKey="articleA" />
          
          <ArticleFetcher inputKey="articleBUrl" />
          <Group inputKey="articleB" />
        </Form>

      </FormProvider>
    </ModalWithRoute>
  );
};