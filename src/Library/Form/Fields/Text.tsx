import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent, useCallback } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { useInputValue} from '../Consumer';
import { FormDataItem } from '../Types';
import { InputProps } from './Input';

export interface TextProps {}

type TextValues<Data extends Object = {}> = {[key in keyof Data]: string};

export const Text: FunctionComponent<InputProps<TextValues>> = <Data extends TextValues<Data>>({
  className,
  disabled,
  hideLabel,
  inputKey
}: InputProps<Data>) => {

  const [inputValue, setInputValue] = useInputValue<Data>(inputKey as keyof Data);

  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    
    if (setInputValue && inputValue) {
      
      const newFormValue: FormDataItem<Data> = {
        ...inputValue,
        value: value as any,
      };
      setInputValue(inputKey, newFormValue);
    }
  }, [inputKey, inputValue, setInputValue]);

  const handleFocus = useCallback(() => {
    if (setInputValue && inputValue) {
      const newFormValue: FormDataItem<Data> = {
        ...inputValue,
        touched: true,
      };
      setInputValue(inputKey, newFormValue);
    }
  }, [inputKey, inputValue, setInputValue]);

  const isValid = inputValue?.pristine || inputValue?.isValid ? true : false;
  const name = inputValue?.name as string;

  return (
    <FormGroup className={className}>
      {!hideLabel && (
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
      <textarea
        className={classNames('form-control', {
          'is-invalid': !isValid,
        })}
        disabled={disabled || (inputValue && inputValue.disabled) ? true : false}
        name={name}
        placeholder={inputValue?.config?.placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        value={inputValue?.value || ''}
      />
    </FormGroup>
  );
}