import { isEqual, isNumber } from 'lodash';
import React, { FunctionComponent, useCallback } from 'react';
import { FormGroup } from 'reactstrap';

import { withFormValue } from '../Consumer';
import { Form } from '../Form';
import { FormInputTypes } from '../Keys';
import { FormProvider } from '../Provider';
import { FormContextValue, SubmitData } from '../Types';
import { InputProps } from './Input';

export interface GroupBaseProps<Data> {
  index?: number;
  onChange?: (data: SubmitData<Data>, index: number) => void;
  reset?: boolean;
}

export type GroupProps<Data> = GroupBaseProps<Data> & FormContextValue<Data>;

type GroupValues<Data extends Object = {}> = {
  [key in keyof Data]: Data | Data[];
};

export const GroupBase: FunctionComponent<
  GroupProps<GroupValues> & InputProps<GroupValues>
> = <Data extends GroupValues<Data>>(
  props: GroupProps<Data> & InputProps<Data>,
  ) => {
    const { data, inputKey, setFormValue, index, onChange, reset } = props;

    const inputValue = data[inputKey as keyof Data];
    console.log(inputValue);

    const { value, config, defaultValue } = inputValue;

    const handleContextChange = useCallback(
      (key: string, context: FormContextValue<Data>) => {
        const { submitData } = context;
        const shouldSetInitialFormValue = isEqual(value, defaultValue);
        const shouldSetFormValue = !isEqual(value, submitData.data);
        const shouldUpdate = shouldSetInitialFormValue && shouldSetFormValue;

        if (
          inputValue.config?.type === FormInputTypes.Group &&
          shouldUpdate
        ) {

          setFormValue(key as keyof Data, {
            ...inputValue,
            isValid: submitData.isValid,
            touched: true,
            value: submitData.data,
          });
        }

        if (
          inputValue.config?.type === FormInputTypes.MultipleGroup &&
          isNumber(index)
        ) {
          const newValue = value as Data[];

          if (
            !(value as Data[]).length ||
            !isEqual(newValue[index], submitData.data)
          ) {
            if (onChange) {
              onChange(submitData, index);
            }

            setFormValue(key as keyof Data, {
              ...inputValue,
              isValid: submitData.isValid,
              pristine: submitData.pristine,
              touched: submitData.touched,
              value: newValue,
            });
          }
        }
      },
      [defaultValue, index, inputValue, onChange, setFormValue, value],
    );

    return (
      <FormGroup className={props.className}>
        {config?.group && (
          <FormProvider
            {...props.options}
            data={reset ? defaultValue : value}
            inputConfig={config.group}
            onChange={data => {
              console.log(data);
            }}
            reset={reset}
          >
            <Form
              asForm={false}
              inputKey={inputKey as string}
              onContextChange={(key, context) =>
                handleContextChange(key, context as any)
              }
            />
          </FormProvider>
        )}
      </FormGroup>
    );
  };

export const Group = withFormValue<InputProps<Object> & GroupBaseProps<Object>>(
  GroupBase,
);
