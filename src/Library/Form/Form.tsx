import React, { FunctionComponent, useContext } from 'react';
import { Form as FormElement } from 'reactstrap';

import { FormContext } from './Context';
import { Input, MultipleInput, Select, DateInput } from './Fields';
import { FormInputTypes } from './Keys';
import { FormContextValue, FormData, FormEvent } from './Types';

export interface FormProps<Data extends Object = {}> {
  className?: string;
  data?: FormData<Data>;
  inline?: boolean;
  onChange?: <D>(event: FormEvent<D>) => void;
  onSubmit?: <D>(event: FormEvent<D>) => void;
}

export const Form: FunctionComponent<FormProps> = <Data extends Object>(
  props: FormProps<Data>
) => {
  const context = useContext(FormContext as React.Context<FormContextValue<Data> | undefined>);
  
  let data: FormData<Data>;
  if (!(context && context.data)) {
    console.warn('Context Provider is missing, using data from props.');
    if (props.data) {
      data = props.data;
    } else {
      console.warn('Could not render Form, data property is missing.');
      return null;
    }
  } else {
    data = context.data;
  }

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    if (props.onChange && context) {
      props.onChange<Data>({
        ...event,
        data: context.data,
        submitData: context.submitData,
      })
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (props.onSubmit && context) {
      props.onSubmit<Data>({
        ...event,
        data: context.data,
        submitData: context.submitData,
      })
    }
  }

  return (
    <FormElement 
      className={props.className}
      inline={props.inline}
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      {(Object.keys(data) as (keyof FormData<Data>)[]).map((propertyKey, index) => {
        const item = data[propertyKey];

        if (!item.shouldRender || !item.config) {
          return null;
        }

        const key = `form_${context?.formId}_${item.config.type}_${index}`;
        
        switch (item.config.type) {
          case FormInputTypes.Date:
            return (
              <React.Fragment key={key}>
                <DateInput propertyKey={propertyKey as string} />
              </React.Fragment>
            );
          case FormInputTypes.Multiple:
            return (
              <React.Fragment key={key}>
                <MultipleInput propertyKey={propertyKey as string} />
              </React.Fragment>
            );
          case FormInputTypes.Email:
          case FormInputTypes.Number:
          case FormInputTypes.Password:
          case FormInputTypes.String:
            return (
              <React.Fragment key={key}>
                <Input propertyKey={propertyKey as string} />
              </React.Fragment>
            );
          case FormInputTypes.Select:
            return (
              <React.Fragment key={key}>
                <Select propertyKey={propertyKey as string} />
              </React.Fragment>
            );
          case FormInputTypes.Static:
          default:
            return (
              <React.Fragment key={key}>
                {item.value}
              </React.Fragment>
            );
        }
      })}
    </FormElement>
  );
};