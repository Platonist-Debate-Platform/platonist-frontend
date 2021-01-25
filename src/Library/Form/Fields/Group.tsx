// import classNames from 'classnames';
import { isEqual, isNumber } from "lodash";
import React, { FunctionComponent, useCallback } from "react";
import { FormGroup } from "reactstrap";

import { withFormValue } from "../Consumer";
import { Form } from "../Form";
import { FormInputTypes } from "../Keys";
import { FormProvider } from "../Provider";
import { FormContextValue, SubmitData } from "../Types";
import { InputProps } from "./Input";

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
  props: GroupProps<Data> & InputProps<Data>
) => {
  const { data, inputKey, setFormValue, index, onChange, reset } = props;

  const inputValue = data[inputKey as keyof Data];

  const { value, config } = inputValue;

  const handleContextChange = useCallback(
    (key: string, context: FormContextValue<Data>) => {
      const { submitData } = context;

      if (
        inputValue.config?.type === FormInputTypes.Group &&
        !isEqual(value, submitData.data)
      ) {
        setFormValue(key as keyof Data, {
          ...inputValue,
          isValid: submitData.isValid,
          pristine: submitData.pristine,
          touched: submitData.touched,
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
    [index, inputValue, onChange, setFormValue, value]
  );

  return (
    <FormGroup className={props.className}>
      {config?.group && (
        <FormProvider
          {...props.options}
          data={value}
          inputConfig={config.group}
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
  GroupBase
);
