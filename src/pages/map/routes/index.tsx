import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import Map from './Map';

export default function MapRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<Map />} />
        </Routes>
      </Can>
    </>
  );
};
