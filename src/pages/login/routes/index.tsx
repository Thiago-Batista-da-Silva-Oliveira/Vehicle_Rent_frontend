import { Route, Routes } from 'react-router-dom';
import Login from './Login';

export const SessionRoutes = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
    </>
  );
};
