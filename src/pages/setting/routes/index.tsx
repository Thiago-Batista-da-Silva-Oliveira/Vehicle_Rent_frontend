import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import Settings from './Settings';
export default function SettingsRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<Settings />} />
        </Routes>
      </Can>
    </>
  );
};
