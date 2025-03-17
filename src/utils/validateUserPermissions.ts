import { UserPermission } from "../types/User";

  
  type ValidateUserPermissionsParams = {
    userPermissions: UserPermission[];
    permissions:  UserPermission[];
  };
  
  export function validateUserPermissions({
    userPermissions,
    permissions,
  }: ValidateUserPermissionsParams): boolean {
    if (permissions && permissions?.length > 0) {
      const hasPermission = permissions.some(permission =>
        userPermissions.includes(permission)
      )

      if (!hasPermission) {
        return false 
        }
    }
  
    return true;
  }
  