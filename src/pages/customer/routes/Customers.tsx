import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { Customer, CustomerFormData } from '../../../types/Customer';
import { 
  useCreateCustomer, 
  useUpdateCustomer,
} from '../../../services/customerService';

import CustomersList from '../components/CustomersList';
import CustomerForm from '../components/CustomerForm';
import AssociateVehicleForm from '../components/AssociateVehicleForm';

const CustomersPage: React.FC = () => {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const [tabValue, setTabValue] = React.useState(0);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [associateVehicleOpen, setAssociateVehicleOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerFormOpen(true);
  };

  const handleAssociateVehicle = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAssociateVehicleOpen(true);
  };

  const handleCustomerFormClose = () => {
    setCustomerFormOpen(false);
  };

  const handleAssociateVehicleClose = () => {
    setAssociateVehicleOpen(false);
  };

  const handleCustomerSubmit = async (data: CustomerFormData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer.mutateAsync({
          id: selectedCustomer.id,
          data
        });
      } else {
        await createCustomer.mutateAsync(data);
      }
      setCustomerFormOpen(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleAssociateVehicleSubmit = async (customerId: string, vehicleId: string) => {
    try {
      // TODO: Implement vehicle association
      console.log(`Associating vehicle ${vehicleId} with customer ${customerId}`);
      setAssociateVehicleOpen(false);
    } catch (error) {
      console.error('Error associating vehicle:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
          Adicionar Cliente
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
          <Tab label="Todos os Clientes" />
          <Tab label="Pessoa Física" />
          <Tab label="Pessoa Jurídica" />
        </Tabs>
      </Card>

      <CustomersList 
        onEdit={handleEditCustomer}
        onAssociateVehicle={handleAssociateVehicle}
      />

      <CustomerForm
        open={customerFormOpen}
        customer={selectedCustomer}
        onClose={handleCustomerFormClose}
        onSubmit={handleCustomerSubmit}
      />

      <AssociateVehicleForm
        open={associateVehicleOpen}
        customer={selectedCustomer}
        onClose={handleAssociateVehicleClose}
        onSubmit={handleAssociateVehicleSubmit}
      />
    </Box>
  );
};

export default CustomersPage;