import React, { FunctionComponent } from 'react';
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';

import {
  createDefaultData,
  Form,
  FormClickEvent,
  FormDataConfig,
  FormEvent,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
  getDefaultDataFromResult,
  randomHash,
  RequestStatus,
  User,
} from '../../../Library';
import { SubmitButton } from '../../../Library/Form/Fields';
import useUser from '../../Hooks/Requests/useUser';

const profileFormData: FormDataConfig<Partial<User>>[] = [{
  editable: true,
  key: 'firstName',
  required: true,
  title: 'First name',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}, {
  editable: true,
  key: 'lastName',
  required: true,
  title: 'Last name',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}, {
  editable: false,
  key: 'username',
  required: true,
  title: 'Username',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}];

export const ProfileForm: FunctionComponent = () => {
  const {
    user: {
      result: user,
      status,
    },
    send
  } = useUser();

  const defaultData = (user && getDefaultDataFromResult<Partial<User >>(user, profileFormData)) ||  createDefaultData<Partial<User >>(profileFormData);
  
  const handleSubmit = <Ev extends FormClickEvent<Partial<User >> | FormEvent<Partial<User >>>(event: Ev) => {    
    if (!event.submitData.isValid && !user) {
      return;
    }

    const data = event.submitData.data;

    send({
      data: {
        ...user,
        ...data,
      }, 
      method: 'PUT'
    });
  };

  return (
    <FormProvider
      inputConfig={profileFormData}
      data={defaultData}
    >
      <Form 
        asForm={true}
        onSubmit={handleSubmit}
      >
        <FormGroup>
          <Label>
            E-Mail
          </Label>
          <InputGroup>
            <Input type="email" disabled={true} defaultValue={user?.email} />
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <i className="fa fa-edit"/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label>
            Password
          </Label>
          <InputGroup>
            <Input type="password" disabled={true} defaultValue={randomHash(12)}/>
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <i className="fa fa-edit"/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <div className="text-right">
          <SubmitButton
            className={'btn-success'}
            onClick={(ev) => handleSubmit(ev as any)}
            disabled={status === RequestStatus.Updating}
          >
            Save <i className="fa fa-save" />
          </SubmitButton>
        </div>
      </Form>
    </FormProvider>
  );
}