import { Debate, FormDataConfig, FormInputTypes, FormValidationTypes } from "../../../../Library";

export interface DebateFormData extends Debate {
  articleAUrl: string;
  articleBUrl: string;
}

export const debateFormData: FormDataConfig<Partial<DebateFormData>>[] =[{
  editable: true,
  key: 'title',
  required: true,
  title: 'Debate title',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}, {
  editable: true,
  key: 'subTitle',
  required: true,
  title: 'Debate subtitle',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}, {
  editable: true,
  key: 'shortDescription',
  required: true,
  title: 'Short description',
  type: FormInputTypes.Text,
  validate: FormValidationTypes.Length,
}, {
  editable: true,
  key: 'articleAUrl',
  required: true,
  title: 'Url to Article A',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Url,
}, {
  editable: true,
  key: 'articleA',
  required: true,
  title: 'Url to Article A',
  type: FormInputTypes.Group,
  group: [{
    editable: true,
    key: 'title',
    required: true,
    title: 'Debate title',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  }],
}, {
  editable: true,
  key: 'articleBUrl',
  required: true,
  title: 'Url to Article B',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Url,
}];