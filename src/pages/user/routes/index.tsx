import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import UsersPage from './Users';

export default function UserRoutes() {
  return (
    <>
      <Can 
        roles={[]} 
        permissions={[]}
      >
        <Routes>
          <Route path="/" element={<UsersPage />} />
        </Routes>
      </Can>
    </>
  );
}
