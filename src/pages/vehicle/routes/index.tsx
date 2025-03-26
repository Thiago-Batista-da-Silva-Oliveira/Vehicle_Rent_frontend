import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import Vehicles from './Vehicles';

export default function VehicleRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<Vehicles />} />
        </Routes>
      </Can>
    </>
  );
};
