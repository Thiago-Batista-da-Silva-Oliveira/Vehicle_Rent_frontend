import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import CollectionsDashboard from './Collection';

export default function CollectionRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<CollectionsDashboard />} />
        </Routes>
      </Can>
    </>
  );
};
