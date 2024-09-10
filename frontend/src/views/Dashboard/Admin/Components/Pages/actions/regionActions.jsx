import axiosInstance from './metierInstance';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

// Action pour ajouter un rôle
export const addRegion = (regionData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("http://127.0.0.1:8000/api/regions", regionData);

      if (response.data.status === 200) {
        toast.success('Région ajouté avec succès');
        dispatch(fetchRegions());
      } else {
        toast.error('Erreur lors de l\'ajout du région');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};

// Action pour mettre à jour un rôle
export const updateRegion = (regionData) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.put(`http://127.0.0.1:8000/api/regions/${regionData.id}`, regionData);

      if (response.data.status === 200) {
        toast.success('Région mis à jour avec succès');
        dispatch(fetchRegions());
      } else {
        toast.error('Erreur lors de l\'ajout du région');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};

export const deleteRegion = (regionId) => {
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
        const response = await axiosInstance.delete(`/regions/${regionId}`);

        if (response.data.status === 200) {
          toast.success('Région supprimée avec succès');
          dispatch(fetchRegions());
          
        } else {
          toast.error('Erreur lors de la suppression de la région');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      toast.error('Erreur lors de la requête API');
    }
  };
};

// Action pour récupérer la liste des rôles
export const fetchRegions = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/regions');

      if (response.data.status === 200) {
        dispatch({
          type: 'FETCH_REGIONS',
          payload: response.data.regions
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
