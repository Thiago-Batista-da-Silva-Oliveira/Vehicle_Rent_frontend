import { Route, Routes } from 'react-router-dom';
import { Can } from '../../../components/can';
import Calendar from './Calendar';

export default function CalendarRoutes ()  {
  return (
    <>
      <Can roles={[]} permissions={[]}>
        <Routes>
          <Route path="/" element={<Calendar />} />
        </Routes>
      </Can>
    </>
  );
};
