import React, { FunctionComponent } from 'react';
import { ModalWithRoute } from '../../Modal';

export interface DebateDeleteProps {
  from: string;
  to: string;
}

export const DebateDelete: FunctionComponent<DebateDeleteProps> = (props) => {
  return (
    <ModalWithRoute
      {...props}
      header={'Delete Debate'}
      size={'sm'}
      // onClosed={handleModalClose}
    >
      Delete
    </ModalWithRoute>
  );
};
