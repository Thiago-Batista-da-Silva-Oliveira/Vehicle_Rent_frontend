import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { IRental, useGetAllRentals, useUpdateRentalStatus, useCompleteRental } from '../../../services/rentalService';
import RentalsList from '../components/RentalsList';
import RentalForm from '../components/RentalForm';
import CompleteRentalForm from '../components/CompleteRentalForm';

const RentalsPage: React.FC = () => {
  // Estados
  const [tabValue, setTabValue] = useState(0);
  const [rentalFormOpen, setRentalFormOpen] = useState(false);
  const [completeFormOpen, setCompleteFormOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<IRental | null>(null);

  // Queries e Mutations
  const updateRentalStatus = useUpdateRentalStatus();
  const completeRental = useCompleteRental();
  
  // Filtrar aluguéis de acordo com a tab selecionada
  const filters = {
    status: tabValue === 0 ? 'SCHEDULED' : 
            tabValue === 1 ? 'ACTIVE' : 
            tabValue === 2 ? 'COMPLETED' : 
            tabValue === 3 ? 'CANCELLED' : undefined
  };
  
  const { data: rentals = [], isLoading } = useGetAllRentals(filters);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddRental = () => {
    setSelectedRental(null);
    setRentalFormOpen(true);
  };

  const handleActivateRental = async (rental: IRental) => {
    try {
      await updateRentalStatus.mutateAsync({
        id: rental.id,
        data: { status: 'ACTIVE' }
      });
    } catch (error) {
      console.error('Error activating rental:', error);
    }
  };

  const handleCancelRental = async (rental: IRental) => {
    try {
      await updateRentalStatus.mutateAsync({
        id: rental.id,
        data: { status: 'CANCELLED' }
      });
    } catch (error) {
      console.error('Error cancelling rental:', error);
    }
  };

  const handleCompleteRental = (rental: IRental) => {
    setSelectedRental(rental);
    setCompleteFormOpen(true);
  };

  const handleRentalFormClose = () => {
    setRentalFormOpen(false);
  };

  const handleCompleteFormClose = () => {
    setCompleteFormOpen(false);
    setSelectedRental(null);
  };

  const handleCompleteSubmit = async (data: { actualEndDate: Date, finalMileage: number, observations?: string }) => {
    if (selectedRental) {
      try {
        await completeRental.mutateAsync({
          id: selectedRental.id,
          data: {
            actualEndDate: data.actualEndDate,
            finalMileage: data.finalMileage,
            observations: data.observations
          }
        });
        setCompleteFormOpen(false);
        setSelectedRental(null);
      } catch (error) {
        console.error('Error completing rental:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Aluguéis
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRental}
        >
          Novo Aluguel
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Agendados" />
          <Tab label="Ativos" />
          <Tab label="Concluídos" />
          <Tab label="Cancelados" />
        </Tabs>
      </Card>

      <RentalsList 
        rentals={rentals}
        onActivate={handleActivateRental}
        onCancel={handleCancelRental}
        onComplete={handleCompleteRental}
      />

      <RentalForm
        open={rentalFormOpen}
        onClose={handleRentalFormClose}
      />

      <CompleteRentalForm
        open={completeFormOpen}
        rental={selectedRental}
        onClose={handleCompleteFormClose}
        onSubmit={handleCompleteSubmit}
      />
    </Box>
  );
};

export default RentalsPage; 