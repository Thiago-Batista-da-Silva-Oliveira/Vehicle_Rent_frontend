import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './Dashboard';
import { Can } from '../../../components/can';

export const DashboardRoutes = () => {
  return (
    <>
      <Can roles={['admin']} permissions={[]}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Can>
    </>
  );
};
