import React, { FunctionComponent } from 'react';

import { ApplicationKeys, RestMethodKeys, RolePermissionTypes, User } from '../../../Library';
import { usePermission } from '../../Hooks';

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

    </>
  );
};



export default HomepageSettings;