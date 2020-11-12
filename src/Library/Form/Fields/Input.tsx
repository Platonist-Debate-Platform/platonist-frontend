import classNames from 'classnames';
import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { FormGroup, Label } from 'reactstrap';

import { useFormValue } from '../Consumer';
import { FormInputTypes } from '../Keys';

export interface InputProps<Data extends Object> {
  className?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  propertyKey: keyof Data | string;
}

export const Input: FunctionComponent<InputProps<Object>> = <Data extends Object>(
  props: InputProps<Data>
) => {

  const {formValue, setFormValue} = useFormValue(props.propertyKey as keyof Data);
  
  const [inputValue, setInputValue] = useState(formValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (inputValue && setFormValue) {
      const newFormValue = {
        ...inputValue,
        value,
      };
      setInputValue(newFormValue);
      setFormValue(props.propertyKey, newFormValue);
    }
  }

  const handleFocus = () => {
    if (inputValue && setFormValue) {
      const newFormValue = {
        ...inputValue,
        touched: true,
      };
      
      setInputValue(newFormValue);
      setFormValue(props.propertyKey, newFormValue);
    }
  };

  const isValid = formValue?.pristine || formValue?.isValid ? true : false;
  const name = formValue?.name as string;
  
  return (
    <FormGroup className={props.className}>
      {!props.hideLabel && (
        <>
          <Label
            className={classNames({
              'is-invalid': !isValid,
            })}
          >
            {inputValue?.config?.title}
          </Label>
          {' '}
        </>
      )}
      {!isValid && (
        <span className="invalid-feedback">
          {inputValue?.error}
        </span>
      )}
      <input
        autoComplete={inputValue?.config?.autocomplete}
        className={classNames('form-control', {
          'is-invalid': !isValid,
        })}
        disabled={props.disabled || (inputValue && inputValue.disabled) ? true : false}
        value={(inputValue && inputValue.value) as any || ''}
        onChange={handleChange}
        onFocus={handleFocus}
        name={name}
        type={inputValue?.config?.type === FormInputTypes.Number ? FormInputTypes.Number : (inputValue?.config?.type || 'text')}
      />
    </FormGroup>
  );
}