import { Article, Debate, FormDataConfig, FormInputTypes, FormValidationTypes } from '../../../../Library';

export interface DebateFormData extends Debate {
  articleAUrl: string;
  articleBUrl: string;
}

const debateArticleGroupData: FormDataConfig<Partial<Article>>[] = [{
  editable: false,
  key: 'title',
  required: true,
  title: 'Title',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}, {
  editable: false,
  key: 'description',
  required: true,
  title: 'Description',
  type: FormInputTypes.Text,
  validate: FormValidationTypes.Length,
},{
  editable: false,
  key: 'provider',
  required: true,
  title: 'Provider',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Length,
}]

export const debateFormData: FormDataConfig<Partial<DebateFormData>>[] = [{
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
  group: debateArticleGroupData,
}, {
  editable: true,
  key: 'articleBUrl',
  required: true,
  title: 'Article A',
  type: FormInputTypes.String,
  validate: FormValidationTypes.Url,
}, {
  editable: true,
  key: 'articleB',
  required: true,
  title: 'Article B',
  type: FormInputTypes.Group,
  group: debateArticleGroupData,
}];