import React, { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { GlobalState } from '../../../Library';

export interface EditModalProps {
  className?: string;
  location: string;
}

export const EditModal: FunctionComponent<EditModalProps> = ({
  className,
  children,
}) => {
  
  const router = useSelector((state: GlobalState) => state.router);
  console.log(router);
  
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <Modal isOpen={modal} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>Modal title</ModalHeader>
      <ModalBody>
        {children}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default EditModal;