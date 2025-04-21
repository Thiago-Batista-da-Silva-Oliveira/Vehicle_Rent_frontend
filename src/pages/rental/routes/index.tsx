import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import RentalsPage from './Rentals';
import { Can } from '../../../components/can';

const RentalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Can
            roles={[]}
            permissions={[]}
          >
            <RentalsPage />
          </Can>
        }
      />
    </Routes>
  );
};

export default RentalRoutes; 