import { isArray } from 'lodash';
import { useEffect, useState } from 'react';

import {
  ApplicationController,
  ApplicationKeys,
  PrivateRequestKeys,
  RestMethodKeys,
  Role,
  RolePermission,
  RolePermissions,
  RolePermissionTypes,
  RoleState,
} from '../../../Library';
import { useRoles } from '../Requests';

export interface HasPermissionOptions {
  methods: RestMethodKeys | RestMethodKeys[],
  permission: RolePermissionTypes,
  type: ApplicationKeys,
}

export const hasPermission = (
  permissions: RolePermissions, 
  options: HasPermissionOptions
): boolean => {
  if (isArray(options.methods)) {
    return options.methods.some(methods => hasPermission(permissions, {
      ...options,
      methods,
    }));
  }

  const rolePermission = permissions[options.permission] as RolePermission<unknown>;
  const controller = rolePermission && rolePermission.controllers as ApplicationController;
  const policy = controller && controller[options.type as any][options.methods]

  return (policy && policy.enabled) || false;
};

export interface UsePermissionProps extends HasPermissionOptions {
  id?: string,
}

export type UsePermission = (props: UsePermissionProps) => [boolean, Role | undefined];

export const usePermission: UsePermission = ({
  id,
  ...rest
}) => {
  const roleState = useRoles(PrivateRequestKeys.Role, id) as RoleState;

  const [role, setRole] = useState(roleState.result?.role);
  const [isAllowed, setIsAllowed] = 
    useState(role && hasPermission(role.permissions, rest));

  useEffect(() => {
    if (role?.id !== roleState?.result?.role.id) {
      setRole(roleState?.result?.role);
    }
    if (role && hasPermission(role.permissions, rest) !== isAllowed) {
      setIsAllowed(hasPermission(role.permissions, rest));
    }
  }, [
    isAllowed,
    rest,
    role,
    roleState,
    setRole,
  ]);

  return [isAllowed || false, role];
};