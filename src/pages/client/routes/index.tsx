import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import ClientsPage from './Clients';

export default function ClientRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<ClientsPage />} />
        </Routes>
      </Can>
    </>
  );
};
