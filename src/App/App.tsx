import React from 'react';

import { getCurrentHomepage, RequestStatus, SetScrollPosition } from '../Library';
import { useHomepages } from './Hooks';
import HomepageRoutes from './Partials/Routes/HomepageRoutes';
import LoaderMain from './Partials/Loader/LoaderMain';
import { Loader, NotFound } from './Partials';

export const App: React.FC = () => {
  const homepages = useHomepages();
  const location = window.location;
  const homepage = homepages.result && getCurrentHomepage(location, homepages.result);

  if (!homepages) {
    return null;
  }

  switch (homepages.status) {
    case RequestStatus.Loaded:
      return (
        <>
          <Loader />
          <SetScrollPosition>
            {homepage ? (
              <HomepageRoutes {...homepage} />
            ) : (
              <NotFound />
            )}
          </SetScrollPosition>
        </>
      );
    case RequestStatus.Error:
      return (
        <NotFound />
      );
    case RequestStatus.Initial:
    case RequestStatus.Updating:
    default:
      return (
        <LoaderMain />
      );
  }
};

export default App;
