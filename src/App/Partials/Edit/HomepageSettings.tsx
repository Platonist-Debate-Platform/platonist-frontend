import React, { FunctionComponent } from 'react';

import { ApplicationKeys, RestMethodKeys, RolePermissionTypes, User } from '../../../Library';
import { usePermission } from '../../Hooks';
import { EditModal } from './EditModal';

export interface HomepageSettingsProps {
  user: User;
}

export const HomepageSettings: FunctionComponent<HomepageSettingsProps> = ({
  user
}) => {
  
  const [hasPermission] = usePermission({
    id: user?.role?.id,
    methods: [RestMethodKeys.Update, RestMethodKeys.Create],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Homepage,
  })

  console.log(hasPermission);
  
    return (
    <>
      <EditModal location="abc">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </EditModal>
    </>
  );
};



export default HomepageSettings;