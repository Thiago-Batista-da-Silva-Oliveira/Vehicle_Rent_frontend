import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import FinesPage from './FineManagement';

export default function FineManagementRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<FinesPage />} />
        </Routes>
      </Can>
    </>
  );
};
