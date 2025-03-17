import { ReactNode } from 'react';
import { useCan } from '../../hooks/useCan';
import { UserPermission, UserRole } from '../../types/User';

type CanProps = {
  children: ReactNode;
  roles: UserRole[];
  permissions: UserPermission[];
};

export function Can({
  children,
  permissions,
  roles,
}: CanProps): JSX.Element | null {
  const userCanSeeComponent = useCan({
     permissions,
     roles,
  });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}

