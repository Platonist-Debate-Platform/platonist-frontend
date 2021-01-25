import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Redirect } from "react-router-dom";
import { Col, Form, Row } from "reactstrap";

import {
  createDefaultData,
  DebateState,
  FormClickEvent,
  FormProvider,
  PublicRequestKeys,
  RequestStatus,
  RestMethodKeys,
} from "../../../../Library";
import {
  Group,
  Input,
  SubmitButton,
  Text,
} from "../../../../Library/Form/Fields";
import { useDebates } from "../../../Hooks";
import { ModalWithRoute } from "../../Modal";
import {
  ArticleFetcherOnClear,
  ArticleFetcherOnReceive,
  FormArticleFetcher,
} from "./FormArticleFetcher";
import { DebateFormData, debateFormData } from "./FormData";
import { DebateSettingsProps } from "./Settings";

export interface DebateFormProps extends DebateSettingsProps {
  from: string;
  to: string;
}

const DebateModalHeader: FunctionComponent<{
  method: DebateFormProps["method"];
}> = ({ method }) => {
  switch (method) {
    case RestMethodKeys.Create:
      return <>Create a new Debate</>;
    default:
      return null;
  }
};

export const DebateForm: FunctionComponent<DebateFormProps> = ({
  method,
  debateId,
  ...props
}) => {
  const {
    clear,
    data: { result: debate, status },
    send,
  } = useDebates<DebateState>(PublicRequestKeys.Debate);

  const isDeleteMethod = method !== RestMethodKeys.Delete ? true : false;

  const [defaultData, setDefaultData] = useState(
    createDefaultData<Partial<DebateFormData>>(debateFormData)
  );

  const [formData, setFormData] = useState(debateFormData);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [resetGroups, setResetGroups] = useState<string | undefined>();

  const handleSubmit = useCallback(
    (event: FormClickEvent<Partial<DebateFormData>>) => {
      const { data: submitData, isValid } = event.submitData;
      if (submitData.articleAUrl) {
        delete submitData.articleAUrl;
      }
      if (submitData.articleBUrl) {
        delete submitData.articleBUrl;
      }

      if (status === RequestStatus.Initial && isValid && submitData) {
        send({
          method: (method === RestMethodKeys.Create && "POST") || "PUT",
          data: submitData as any,
        });
      }
    },
    [method, send, status]
  );

  const handelReceive: ArticleFetcherOnReceive<DebateFormData> = useCallback(
    (key, data) => {
      setDefaultData({
        ...defaultData,
        [key]: data,
      });

      const index = debateFormData.findIndex(
        (formData) => formData.key === key
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

      if (!resetGroups) {
        setResetGroups(key);
      }
    },
    [defaultData, formData, resetGroups]
  );

  const handleClear: ArticleFetcherOnClear<DebateFormData> = useCallback(
    (key, [inputValue, setInputValue]) => {
      const index = debateFormData.findIndex(
        (formData) => formData.key === key
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

      if (!resetGroups) {
        setResetGroups(key);
      }
    },
    [defaultData, formData, resetGroups]
  );

  useEffect(() => {
    if (resetGroups) {
      setResetGroups(undefined);
    }

    if (status === RequestStatus.Loaded && debate) {
      clear();
      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [clear, debate, defaultData, resetGroups, shouldRedirect, status]);

  return (
    <FormProvider
      data={defaultData}
      inputConfig={formData}
      reset={shouldRedirect}
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
        size={isDeleteMethod ? "xl" : "sm"}
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
              <Group
                inputKey="articleA"
                reset={resetGroups === "articleA" ? true : false}
              />
            </Col>
            <Col sm={6}>
              <FormArticleFetcher
                dataKey="articleB"
                inputKey="articleBUrl"
                onClear={handleClear}
                onReceive={handelReceive}
              />
              <Group
                inputKey="articleB"
                reset={resetGroups === "articleB" ? true : false}
              />
            </Col>
          </Row>
        </Form>
      </ModalWithRoute>
      {shouldRedirect && <Redirect to={props.from} />}
    </FormProvider>
  );
};
