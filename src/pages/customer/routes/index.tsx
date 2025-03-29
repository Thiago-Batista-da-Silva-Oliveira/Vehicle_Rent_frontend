import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import CustomersPage from './Customers';

export default function CustomerRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<CustomersPage />} />
        </Routes>
      </Can>
    </>
  );
};
