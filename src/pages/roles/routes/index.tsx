import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import RolesPage from './Roles';

export default function RoleRoutes() {
  return (
    <>
      <Can 
        roles={[]} 
        permissions={[]}
      >
        <Routes>
          <Route path="/" element={<RolesPage />} />
        </Routes>
      </Can>
    </>
  );
}
