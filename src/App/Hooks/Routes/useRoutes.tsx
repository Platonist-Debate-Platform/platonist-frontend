import React from 'react';
import { Page, ContentKeys, Homepage } from "../../../Library";
import { PageResolver, ContentResolverItem } from '../../Partials';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

export interface PageRoutesProps {
  isAdmin: boolean;
  pages?: (Page | null)[];
  parentPath?: string;
}

export const createRoutes = (props: PageRoutesProps): RouteProps[] => {
  const {
    isAdmin,
    pages,
    parentPath,
  } = props;

  const routes: RouteProps[] = [];

  if (!pages) {
    return routes;
  }

  pages.forEach((page, index) => {
    if (!page || (page && !page.active)) {
      return false;
    }

    const path = (parentPath || '') + `/${page.title}`;

    routes.push({
      exact: true,
      path,
      render: () => <PageResolver pageId={page.id} path={path} isAdmin={isAdmin} />,
    });

    if (page.content && page.content.length > 0) {
      page.content.forEach((item, index) => {
        if (item) {
          switch(item.__component) {
            case ContentKeys.BranchList:
            case ContentKeys.JobList:
            case ContentKeys.ServiceList:
              routes.push({
                exact: true,
                path: `${path}/:title`,
                render: (props: RouteComponentProps) => 
                  <ContentResolverItem 
                    {...item}
                    isAdmin={isAdmin} 
                    path={path} 
                    routeProps={props} 
                />,
              });
              break;
            default:
              break;
          }
        }
      })
    }

    if (page.pages && page.pages.length > 0) {
      routes.push(...createRoutes({pages: page.pages, parentPath: path, isAdmin}));
    }

  });

  return routes;
}

export const concatPages = (homepages: Homepage[]):Page[] => {
  const pages: Page[] = [];
  homepages.forEach(homepage => 
    homepage.pages && homepage.pages.forEach(page => page && pages.push(page))
  );
  return pages;
}

export const useRoutes = (props: PageRoutesProps): RouteProps[] => {
  const routes = createRoutes(props);
  return routes;
}