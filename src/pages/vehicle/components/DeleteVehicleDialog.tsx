import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useDeleteVehicle } from '../../../services/vehicleService';

interface DeleteVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string | null;
}

const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({ 
  open, 
  onClose, 
  vehicleId 
}) => {
  const deleteVehicle = useDeleteVehicle();
  
  const handleConfirmDelete = async () => {
    if (vehicleId) {
      try {
        await deleteVehicle.mutateAsync(vehicleId);
        onClose();
      } catch (error) {
        // O erro já está sendo tratado pelo hook useDeleteVehicle
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleConfirmDelete}
          color="error"
          disabled={deleteVehicle.isLoading || !vehicleId}
        >
          {deleteVehicle.isLoading ? <CircularProgress size={24} /> : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVehicleDialog; 