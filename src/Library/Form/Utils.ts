import {
  CreateInitialFormDataProps,
  FormData,
  FormDataItem,
  HandleValidationFn,
  PrepareValidationValuesFn,
  ValidateValue,
  SubmitData,
} from './Types';

import { validate } from './Validate';
import { FormInputTypes } from './Keys';

export const createInitialFormData = <Data extends Object>(props: CreateInitialFormDataProps<Data>) => {
  const {
    data,
    inputConfig,
    preValidate,
  } = props;
  
  const formData: FormData<Data> | {} = {}

  inputConfig.forEach((config) => {
    const key = config.key;
    const value = config.type === FormInputTypes.Number && data[key] ? (data[key] as any).toString() : data[key];
    const comparison = config?.comparison as unknown;
    
    let isValid: boolean = true;
    let error: string | string[] | undefined = undefined;

    const shouldPreValidate = (preValidate || config?.preValidate) ? true : false;
    
    if (shouldPreValidate && config?.validate) {
      error = validateValues({
        comparison: comparison as string | string[],
        options: config?.validateOptions,
        types: config?.validate,
        value: value as ValidateValue,
      });

      if (Array.isArray(error)) {
        isValid = error.some(err => err.length === 0);
      } else {        
        isValid = (error || error?.length) ? false : true;
      }  
    }

    const formDataItem: FormDataItem<Data> = {
      config,
      defaultValue: value as FormDataItem<Data>['value'],
      disabled: !config?.editable ? true : false,
      error,
      isValid,
      name: key,
      pristine: true,
      shouldRender: config ? true : false,
      touched: false,
      value: value as FormDataItem<Data>['value'],
    };

    Object.assign(formData, {
      [key as keyof Data]: formDataItem,
    });
  });

  return formData as FormData<Data>;
}

export const getSubmitData = <Data extends Object>(formData: FormData<Data>, defaultData: Data): SubmitData<Data> => {
  const formDataAsArray = Object.keys(formData).map(key => formData[key as keyof FormData<Data>])
  const newData: Data | {} = {}
  
  formDataAsArray.forEach(data => Object.assign(newData, {[data.name]: data.value || ''}));
  
  return {
    data: {
      ...defaultData,
      ...newData,
    },
    isValid: !formDataAsArray.some(data => data.config?.required ? !data.isValid : false),
    pristine: !formDataAsArray.some(data => !data.pristine),
    touched: formDataAsArray.some(data => data.touched),
  };
}

export const handleValidation: HandleValidationFn = ({
  types, 
  value, 
  options, 
  comparison
}) => {
  let isValid: string | string[] | undefined = undefined;
 
  if (types) {
    if (Array.isArray(types)) {
      types.forEach(type => {
        const validation = handleValidation({
          comparison,
          options, 
          types, 
          value, 
        });

        if (validation?.length)  {
          isValid = ((Array.isArray(isValid) && isValid) || []);
          isValid.push(validation as string);
        }
      })
    } else {
      isValid = validate({
        comparison,
        options, 
        type: types,
        value,
      });
    }
  }
  return isValid;
};

export const validateValues: PrepareValidationValuesFn = ({
  comparison,
  types, 
  value, 
  options, 
}) => {
  value = value === null || value === undefined ? '' : value;
  
  if (typeof value === 'boolean' || typeof value === 'string') {
    return handleValidation({
      comparison,
      types,
      value: value.toString(),
      options
    });
  } else if (Array.isArray(value)) {

    if (!value.length) {
      return 'Should contain Values';
    }

    const isValid: string | string[] = [];
    value.forEach(v => {
      const validate = handleValidation({
        comparison,
        types,
        value: v,
        options
      });

      if (validate && typeof validate === 'string') {
        isValid.push(validate);
      }
      else if (Array.isArray(validate)) {
        isValid.push(...validate);
      } else {
        isValid.push('')
      }
    });

    return isValid;
  }

  return undefined;
};