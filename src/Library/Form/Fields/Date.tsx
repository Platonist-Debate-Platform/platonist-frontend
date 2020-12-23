import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { FormGroup, Label } from 'reactstrap';
import DatePicker from 'react-datepicker';

import { withFormValue } from '../Consumer';
import { FormContextValue } from '../Types';
import { InputProps } from './Input';
import validator from 'validator';

export type DateInputProps<Data> = InputProps<Data> & FormContextValue<Data>;

type DateInputValues<Data extends Object = {}> = {[key in keyof Data]: string};

export const DateInputBase: FunctionComponent<DateInputProps<DateInputValues> & InputProps<DateInputValues>> = <Data extends DateInputValues<Data>>(
  props: DateInputProps<Data> & InputProps<Data>
) => {
  
  const {
    data,
    inputKey,
    setFormValue,
  } = props;
  
  const inputValue = data[inputKey as keyof Data];
  const isValid = inputValue?.pristine || inputValue?.isValid ? true : false;

  const handleChange = (date: Date | null, event: React.SyntheticEvent<HTMLInputElement>) => {
    if (date?.toString() !== inputValue.value) {
      const newInputValue = {
        ...inputValue,
        value: date && (date as any).toISOString(),
      };
      setFormValue(inputKey, newInputValue);
    }
  }

  const handleFocus = () => {
    if (!inputValue.touched) {
      const newInputValue = {
        ...inputValue,
        touched: true,
      };
      setFormValue(inputKey, newInputValue);
    }
  };

  const config = inputValue && inputValue.config;
  const validateOptions: validator.IsLengthOptions | undefined = config && config.validateOptions as validator.IsLengthOptions;

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
      <DatePicker 
        className={classNames('form-control', {
          'is-invalid': !isValid,
        })}
        disabled={props.disabled || (inputValue && inputValue.disabled) ? true : false}
        dateFormat={(config && config.format) || 'dd/MM/yyyy'}
        name={inputValue?.name as string}
        onChange={handleChange}
        onFocus={handleFocus}
        selected={(inputValue && inputValue.value && new Date(inputValue.value)) || new Date()}
        todayButton="Today"
        maxDate={(validateOptions && validateOptions.max && new Date(validateOptions.max)) || null}
        minDate={(validateOptions && validateOptions.min && new Date(validateOptions.min)) || null}
        // value={new Date(inputValue.value).toString()}
      />
    </FormGroup>
  );
};

export const DateInput = withFormValue<InputProps<Object>>(DateInputBase);
 