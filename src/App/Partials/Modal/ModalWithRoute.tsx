import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { GlobalState, PublicRequestKeys } from '../../../Library';

export interface ModalWithRouteProps {
  children: ReactNode;
  footer?: ReactNode;
  from: string;
  header?: ReactNode;
  onClosed?: () => void;
  onOpened?: () => void;
  size?: 'sm'| 'lg' | 'xl';
  to: string;
}

export const ModalWithRoute: FunctionComponent<ModalWithRouteProps> = ({
  children,
  footer,
  from,
  header,
  onClosed,
  onOpened,
  size,
  to,
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const router = useSelector<GlobalState, GlobalState[PublicRequestKeys.Router]>(state => state.router)

  const getCurrentUrlFromLocation = (location: GlobalState[PublicRequestKeys.Router]['location']) => 
    `${location.pathname}${location.search}`;
  
  const toggle = () => {
    if (!shouldRedirect) {
      setShouldRedirect(true);
    }
  }

  useEffect(() => {
    const currentUrl = getCurrentUrlFromLocation(router.location);
    const isFromUrl = from === currentUrl;
    const isToUrl = to === currentUrl;

    if (isFromUrl && !isToUrl && modal) {
      setModal(false);
      setShouldRedirect(false);
    } 
    if (isToUrl && !isFromUrl && !modal) {
      setModal(true);
    }
  }, [
    from,
    modal,
    router,
    to,
  ]);

  return (
    <>
      <Modal 
        isOpen={modal} 
        onClosed={onClosed}
        onOpened={onOpened}
        size={size}
        toggle={toggle} 
      >
        {header && (
          <ModalHeader toggle={toggle}>
            {header}
          </ModalHeader>
        )}
        <ModalBody>
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </Modal>
      {shouldRedirect && (
        <Redirect from={getCurrentUrlFromLocation(router.location)} to={from} />
      )}
    </>
  );
}
