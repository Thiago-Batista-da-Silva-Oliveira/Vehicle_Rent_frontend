import { UserRole } from "../types/User";

  
  type ValidateUserRolesParams = {
    userRole: UserRole;
    roles:  UserRole[];
  };
  
  export function validateUserRole({
    userRole,
    roles,
  }: ValidateUserRolesParams): boolean {
    if (roles && roles?.length > 0) {
      const hasRoles = roles.includes(userRole);
  
      if (!hasRoles) {
        return false;
      }
    }
  
    return true;
  }
  