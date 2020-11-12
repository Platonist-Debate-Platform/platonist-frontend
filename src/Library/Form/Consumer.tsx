import React, { Component, ComponentType, useContext } from 'react';

import { FormContext } from './Context';
import { FormContextValue, KeyOfFormData } from './Types';

export const useFormValue = <Data extends Object>(key: KeyOfFormData<Data>) => {
  const context = useContext<FormContextValue<Data>>(FormContext as React.Context<FormContextValue<Data>>);
  if (!context.data || !(context.data && context.data[key]) ) {
    return {
      formValue: undefined, 
      setFormValue: context.setFormValue
    };
  }

  return {
    formValue: context.data[key], 
    setFormValue: context.setFormValue
  };
}

export const withFormValue = <P extends Object = {}, Data extends Object = {}>(
  WrappedComponent: ComponentType<P & FormContextValue<Data>>
) => class WithFormValues extends Component<P> {
  render () {
    return (
      <FormContext.Consumer>
        {(formContext) => {
          const ctx = formContext as FormContextValue<Data>;
          return <WrappedComponent {...this.props} {...ctx} />
        }}
      </FormContext.Consumer>
    );
  }
}

export const withInputValue = <P extends Object = {}, Data extends Object = {}>(key: keyof Data) => (
  WrappedComponent: ComponentType<P & ReturnType<typeof useFormValue>>
) => class WithFormValues extends Component<P> {
  render () {
    return (
      <FormContext.Consumer>
        {(formContext) => {
          
          const formValue = formContext && formContext.data && formContext.data[key];
          
          return formContext && formValue ? (
            <WrappedComponent 
              {...this.props}
              formValue={formValue}
              setFormValue={formContext.setFormValue}
            />
          ) : null;
        }}
      </FormContext.Consumer>
    );
  }
}