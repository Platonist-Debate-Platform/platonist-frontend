import React, { FunctionComponent } from 'react';

import { ApplicationKeys, RestMethodKeys, RolePermissionTypes } from '../../../../Library';
import { usePermission } from '../../../Hooks';
import { useUser } from '../../../Hooks/Requests';

export interface DebatePermissionProps {
  method?: RestMethodKeys;
}

export const DebatePermission: FunctionComponent<DebatePermissionProps> = ({
  children,
  method,
}) => {
  const {
    user: {
      result: user,
    },
  } = useUser();

  const [hasPermission] = usePermission({
    methods: method || [RestMethodKeys.Create, RestMethodKeys.Update, RestMethodKeys.Delete],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Debate,
    id: user?.role?.id
  });
  
  if (!hasPermission) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}