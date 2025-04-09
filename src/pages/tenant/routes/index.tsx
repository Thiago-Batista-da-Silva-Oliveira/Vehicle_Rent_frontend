import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';

export default function TenantRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<></>} />
        </Routes>
      </Can>
    </>
  );
};
