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
  const state = useRoles(PrivateRequestKeys.Role, id) as RoleState;

  const [allowed, setIsAllowed] = 
    useState(state && state.result && hasPermission(state.result.role.permissions, rest));

  useEffect(() => {
    if (state && state.result && hasPermission(state.result.role.permissions, rest) !== allowed) {
      setIsAllowed(hasPermission(state.result.role.permissions, rest));
    }
  }, [allowed, rest, state]);

  return [allowed || false, state.result?.role];
};