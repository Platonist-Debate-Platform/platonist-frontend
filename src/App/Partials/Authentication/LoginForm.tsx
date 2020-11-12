import React, { FunctionComponent } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Col, Container, Form, Row } from 'reactstrap';

import {
  AutocompleteKeys,
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '../../../Library';
import { Input, SubmitButton } from '../../../Library/Form/Fields';

interface LoginData {
  identifier: string;
  password: string;
}

const loginFormData: FormDataConfig<Partial<LoginData>>[] =[{
  autocomplete: AutocompleteKeys.Email,
  editable: true,
  key: 'identifier',
  required: true,
  title: 'E-Mail',
  type: FormInputTypes.Email,
  validate: FormValidationTypes.Email,
}, {
  autocomplete: AutocompleteKeys.CurrentPassword,
  editable: true,
  key: 'password',
  required: true,
  title: 'Password',
  type: FormInputTypes.Password,
  validate: FormValidationTypes.Length,
  validateOptions: {
    min: 8,
  },
}]

export interface LoginFormProps {
  [PublicRequestKeys.Authentication]: GlobalState[PublicRequestKeys.Authentication];
}

export const LoginFormWithoutState: FunctionComponent<LoginFormProps> = ({
  authentication
}) => {
  
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/local`;

  const handleSubmit = (event: FormClickEvent<LoginData>) => {
    if (!event.submitData.isValid) {
      return;
    }
    
    const data = event.submitData.data;

    dispatch(requestAction.load(PublicRequestKeys.Authentication, {
      data,
      method: 'post',
      url: url.href,
    }));
  }

  return (
    <section className="section section-login">
      <Container>
        <Row>
          <Col md={6} className="offset-md-3">
            <h2>Admin Panel</h2>
            <FormProvider data={{identifier: '', password: ''}} inputConfig={loginFormData}>
              <Form>
                <Input
                  disabled={authentication?.status === RequestStatus.Updating} 
                  propertyKey="identifier"
                />
                <Input
                  disabled={authentication?.status === RequestStatus.Updating} 
                  propertyKey="password"
                />
                <SubmitButton
                  disabled={authentication?.status === RequestStatus.Updating} 
                  onClick={handleSubmit}
                  preventDefault={true}
                  type="submit"
                >
                  Login
                </SubmitButton>
              </Form>
            </FormProvider >
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export const LoginForm = connect((state: GlobalState) => ({
  [PublicRequestKeys.Authentication]: state[PublicRequestKeys.Authentication],
}))(LoginFormWithoutState);