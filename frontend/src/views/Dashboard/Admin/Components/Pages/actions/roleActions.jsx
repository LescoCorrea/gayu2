import { toast } from 'react-toastify';
import axiosInstance from './metierInstance';
import Swal from 'sweetalert2';

// Action pour ajouter un rôle
export const addRole = (roleData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/roles", roleData);

      if (response.data.status === 200) {
        toast.success('Rôle ajouté avec succès');
        dispatch(fetchRoles());
      } else {
        toast.error('Erreur lors de l\'ajout du rôle');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};

// Action pour mettre à jour un rôle
export const updateRole = (roleData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.put(`/roles/${roleData.id}`, roleData);

      if (response.data.status === 200) {
        toast.success('Rôle mis à jour avec succès');
        dispatch(fetchRoles());
      } else {
        toast.error('Erreur lors de la mise à jour du rôle');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};

export const deleteRole = (roleId) => {
  return async (dispatch) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Vous ne pourrez pas revenir en arrière!',
        showCancelButton: true,
        customClass: {
          title: 'swal2-title',
          content: 'swal2-text',
          confirmButton: 'swal2-confirm',
          cancelButton: 'swal2-cancel'
        },
        confirmButtonText: '<i class="fa fa-check"></i> Supprimer',
        cancelButtonText: '<i class="fa fa-times"></i> Annuler'
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.delete(`/roles/${roleId}`);

        if (response.data.status === 200) {
          toast.success('Rôle supprimé avec succès');
          dispatch(fetchRoles());
          
        } else {
          toast.error('Erreur lors de la suppression du rôle');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      // Gérer l'erreur si nécessaire
      toast.error('Erreur lors de la requête API');
    }
  };
};


export const fetchRoles = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get('/roles');

      if (response.data.status === 200) {
        dispatch({
          type: 'FETCH_ROLES',
          payload: response.data.roles
        });
      } else {
        // Gérer l'erreur si nécessaire
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      // Gérer l'erreur si nécessaire
    }
  };
};
