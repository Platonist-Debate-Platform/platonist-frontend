import {
  Article,
  Debate,
  FormDataConfig,
  FormInputTypes,
  FormValidationTypes,
} from '../../../../Library';

export interface DebateFormData extends Debate {
  articleAUrl: string;
  articleBUrl: string;
}

export const createDebateArticleGroupData = (): FormDataConfig<
  Partial<Article>
>[] => [
    {
      editable: true,
      key: 'title',
      required: true,
      title: 'Title',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'description',
      required: true,
      title: 'Description',
      type: FormInputTypes.Text,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'provider',
      required: true,
      title: 'Provider',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'type',
      required: true,
      title: 'Type',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'icon',
      required: true,
      title: 'Icon',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'icon',
      required: true,
      title: 'Icon url',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'image',
      required: true,
      title: 'Image url',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'language',
      required: true,
      title: 'language',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
    {
      editable: true,
      key: 'keywords',
      required: true,
      title: 'Keywords',
      type: FormInputTypes.String,
      validate: FormValidationTypes.Length,
    },
  ];

export const debateArticleGroupData = createDebateArticleGroupData();

export const debateFormData: FormDataConfig<Partial<DebateFormData>>[] = [
  {
    editable: true,
    key: 'title',
    required: true,
    title: 'Debate title',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'subTitle',
    required: true,
    title: 'Debate subtitle',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'shortDescription',
    required: true,
    title: 'Short description',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'articleAUrl',
    required: true,
    title: 'Url to Article A',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Url,
  },
  {
    editable: true,
    key: 'articleA',
    required: true,
    title: 'Article Data',
    type: FormInputTypes.Group,
    group: createDebateArticleGroupData(),
  },
  {
    editable: true,
    key: 'articleBUrl',
    required: true,
    title: 'Url to Article A',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Url,
  },
  {
    editable: true,
    key: 'articleB',
    required: true,
    title: 'Article B',
    type: FormInputTypes.Group,
    group: createDebateArticleGroupData(),
  },
];
