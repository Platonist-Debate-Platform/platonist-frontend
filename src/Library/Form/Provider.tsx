import './Form.scss';

import { isEqual } from 'lodash';
import React, { Component, ReactNode } from 'react';

import { randomHash } from '../Utils';
import { FormContext } from './Context';
import { Form } from './Form';
import { FormContextValue, FormData, FormDataConfig, FormOptions } from './Types';
import { createInitialFormData, getSubmitData, validateValues } from './Utils';

export interface FormProviderProps<Data extends Object = {}> {
  children?: ReactNode;
  data: Data;
  id?: string;
  inputConfig: FormDataConfig<Data>[];
  isProtected?: boolean;
  preValidate?: boolean;
  reset?: boolean;
}

export class FormProvider<Data extends Object = {}> extends Component<FormProviderProps<Data>, FormContextValue<Data>> {
  constructor(props: FormProviderProps<Data>) {
    super(props);
    const {
      data,
      inputConfig,
      isProtected,
      preValidate,
    } = props;

    const options: FormOptions = {
      isProtected: isProtected ? true : false,
      preValidate: preValidate === undefined ? true : preValidate,
    }

    this.setFormValue = this.setFormValue.bind(this);
    const formData = createInitialFormData<Data>({
      data, 
      inputConfig, 
      isProtected: options.isProtected,
      preValidate: options.preValidate,
    });

    this.state = {
      data: formData,
      formId: props.id || randomHash(24),
      options,
      setFormValue: this.setFormValue,
      submitData: getSubmitData(formData, data),
    };
  }

  public setFormValue (key: keyof Data | string, formValue: FormData<Data>[keyof FormData<Data>], comparison?: string | string[]): void {
    const formData = this.state.data;
    
    if (key as keyof Data in formData) {
      const error = formValue.config && validateValues({
        comparison: comparison || formValue.config.comparison as string | undefined,
        group: formValue.config?.group,
        types: formValue.config.validate,
        value: formValue.value as never,
        options: formValue.config.validateOptions
      });

      
      let isValid = false;
      if (Array.isArray(error) && error.length) {
        isValid = error.filter(err => err !== undefined || err === '').some(err => err && err.length === 0);
      } else if (Array.isArray(error) && !error.length) {
        isValid = true;
      } else {        
        isValid = (error || error?.length) ? false : true;
      }
      
      let pristine = true;
      if (Array.isArray(formValue.value)) {
        pristine = Array.isArray(formValue.value) && Array.isArray(formValue.defaultValue) && isEqual(formValue.value, formValue.defaultValue);
      } else {
        pristine = formValue.value === formValue.defaultValue;
      }
      
      const newFormValue: FormData<Data>[keyof Data] = {
        ...formValue,
        error,
        isValid,
        pristine,
      };
      
      const newFormData = Object.assign(formData, {
        [key]: newFormValue,
      });

      this.setState({
        data: newFormData,
        submitData: getSubmitData(newFormData, this.props.data),
      });
    }
  }

  componentDidUpdate(prevProps: FormProviderProps<Data>) {
    const {
      data,
      inputConfig,
      isProtected,
      preValidate,
      reset,
    } = this.props;

    if (reset && !prevProps.reset) {

      const options: FormOptions = {
        isProtected: isProtected ? true : false,
        preValidate: preValidate === undefined ? true : preValidate,
      }

      const formData = createInitialFormData<Data>({
        data, 
        inputConfig, 
        isProtected: options.isProtected,
        preValidate: options.preValidate,
      });
      this.setState({
        data: formData,
        submitData: getSubmitData(formData, data),
      });
    }
  }

  render () {
    const value = this.state as FormContextValue<Data>;
    
    return (
      <FormContext.Provider value={value}>
        {this.props.children ? (
          <>{this.props.children}</>
        ) :  (
          <Form asForm={true} />
        )}
      </FormContext.Provider>
    );
  }
}