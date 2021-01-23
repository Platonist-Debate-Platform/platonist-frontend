import React, { FunctionComponent } from 'react';

import { ApplicationKeys, PrivateRequestKeys, RestMethodKeys, RolePermissionTypes, RoleState } from '../../../../Library';
import { usePermission } from '../../../Hooks';
import { useRoles, useUser } from '../../../Hooks/Requests';

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
  const role = useRoles(PrivateRequestKeys.Role, user?.role?.id) as RoleState;
  
  const [hasPermission] = usePermission({
    methods: method || [RestMethodKeys.Create, RestMethodKeys.Update, RestMethodKeys.Delete],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Debate,
    id: user?.role?.id,
    state: role,
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