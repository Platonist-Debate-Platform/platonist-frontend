import { parse, ParsedUrlQuery, stringify } from 'querystring';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ApplicationKeys,
  Article,
  createDefaultData,
  Debate,
  getDefaultDataFromResult,
  GlobalState,
  PublicRequestKeys,
  RestMethodKeys,
} from '../../../../Library';
import { DebateForm } from './Form';
import {
  debateArticleGroupData,
  DebateFormData,
  debateFormData,
  createDebateArticleGroupData,
} from './FormData';

const cleanParsedSearch = (search: string) => {
  if (search.charAt(0) === '?') {
    return search.substring(1);
  }
  return search;
};

const debateToFormData = (
  debate?: Partial<DebateFormData>,
): Partial<DebateFormData> | undefined => {
  if (!debate) {
    return undefined;
  }
  const articleA = debate.articleA
    ? getDefaultDataFromResult(debate.articleA, debateArticleGroupData)
    : createDefaultData(debateArticleGroupData);

  const articleB = debate.articleB
    ? getDefaultDataFromResult(debate.articleB, debateArticleGroupData)
    : createDefaultData(debateArticleGroupData);

  const defaultData = getDefaultDataFromResult(debate, debateFormData);
  console.log(debate.articleA);

  return {
    ...defaultData,
    articleA: articleA,
    articleAUrl: debate.articleA?.url || '',
    articleB: articleB,
    articleBUrl: debate.articleB?.url || '',
  };
};

export interface DebateFormItemProps {
  debates?: Debate[];
  from: string;
}

export interface CurrentSearchProps extends ParsedUrlQuery {
  modal: ApplicationKeys;
  method: RestMethodKeys;
  id: string;
}

export const DebateFormEdit: FunctionComponent<DebateFormItemProps> = ({
  debates,
  from,
}) => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const currentSearch = parse(
    cleanParsedSearch(location.search),
  ) as CurrentSearchProps;

  const [debate, setDebate] = useState(
    currentSearch.id && debates
      ? debates.find((d) => d.id === Number(currentSearch.id))
      : undefined,
  );

  useEffect(() => {
    const newDebate =
      currentSearch.id && debates
        ? debates.find((d) => d.id === Number(currentSearch.id))
        : undefined;

    if (newDebate?.id !== debate?.id) {
      setDebate(newDebate);
    }
  }, [currentSearch.id, debate?.id, debates]);

  return (
    <DebateForm
      debateDefault={debateToFormData(debate)}
      debateId={currentSearch?.id ? Number(currentSearch.id) : undefined}
      from={from}
      method={currentSearch.method}
      to={`${location.pathname}?${stringify(currentSearch)}`}
    />
  );
};
