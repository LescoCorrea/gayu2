import axiosInstance from './metierInstance';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

// Action pour ajouter un rôle
export const addMetier = (metierData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/metiers", metierData);

      if (response.data.status === 200) {
        toast.success('Métier ajouté avec succès');
        dispatch(fetchMetiers());
      } else {
        toast.error('Erreur lors de l\'ajout du métier');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};


export const updateMetier = (metierData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.put(`/metiers/${metierData.id}`, metierData);

      if (response.data.status === 200) {
        toast.success('Métier mis à jour avec succès');
        dispatch(fetchMetiers());
      } else {
        toast.error('Erreur lors de la mise à jour du rôle');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};

export const deleteMetier = (metierId) => {
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
        const response = await axiosInstance.delete(`/metiers/${metierId}`);

        if (response.data.status === 200) {
          toast.success('Métier supprimé avec succès');
          dispatch(fetchMetiers());
          
        } else {
          toast.error('Erreur lors de la suppression du métier');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};


export const fetchMetiers = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/metiers');

      if (response.data.status === 200) {
        dispatch({
          type: 'FETCH_METIERS',
          payload: response.data.metiers
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
