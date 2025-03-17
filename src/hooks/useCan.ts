import useAuthStore from "../store/authStore";
import { UserPermission, UserRole } from "../types/User";
import { validateUserPermissions } from "../utils/validateUserPermissions";
import {validateUserRole } from "../utils/validateUserRole";

type UseCanParams = {
  roles: UserRole[];
  permissions: UserPermission[];
};

export function useCan({
  permissions,
  roles,
}: UseCanParams): boolean {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return false;
  }

 const userHasValidPermission = validateUserPermissions({
    permissions,
    userPermissions: user?.permissions
 })
  const userHasValidRole = validateUserRole({
    userRole: user?.role,
    roles,
  });
 
  return userHasValidPermission && userHasValidRole;
}
