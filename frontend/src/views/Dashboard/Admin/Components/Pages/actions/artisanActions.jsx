import axios from 'axios';
import axiosInstance from './axiosInstance';
export const CREATE_ARTISAN_REQUEST = 'CREATE_ARTISAN_REQUEST';
export const CREATE_ARTISAN_SUCCESS = 'CREATE_ARTISAN_SUCCESS';
export const CREATE_ARTISAN_FAILURE = 'CREATE_ARTISAN_FAILURE';
export const DELETE_ARTISAN_REQUEST = 'DELETE_ARTISAN_REQUEST';
export const DELETE_ARTISAN_SUCCESS = 'DELETE_ARTISAN_SUCCESS';
export const DELETE_ARTISAN_FAILURE = 'DELETE_ARTISAN_FAILURE';
export const FETCH_ARTISANS_REQUEST = 'FETCH_ARTISANS_REQUEST';
export const FETCH_ARTISANS_SUCCESS = 'FETCH_ARTISANS_SUCCESS';
export const FETCH_ARTISANS_FAILURE = 'FETCH_ARTISANS_FAILURE';
export const UPDATE_ARTISAN_REQUEST = 'UPDATE_ARTISAN_REQUEST';
export const UPDATE_ARTISAN_SUCCESS  = 'UPDATE_ARTISAN_SUCCESS';
export const UPDATE_ARTISAN_FAILURE = 'UPDATE_ARTISAN_FAILURE';
export const UPDATE_ARTISAN_ACCESS_REQUEST = 'UPDATE_ARTISAN_ACCESS_REQUEST';
export const UPDATE_ARTISAN_ACCESS_SUCCESS = 'UPDATE_ARTISAN_ACCESS_SUCCESS';
export const UPDATE_ARTISAN_ACCESS_FAILURE = 'UPDATE_ARTISAN_ACCESS_FAILURE';
export const GET_ACCESS_REQUEST = 'GET_ACCESS_REQUEST';
export const GET_ACCESS_SUCCESS = 'GET_ACCESS_SUCCESS';
export const GET_ACCESS_FAILURE = 'GET_ACCESS_FAILURE';
export const FETCH_ARTISAN_BY_ID_SUCCESS = 'FETCH_ARTISAN_BY_ID_SUCCESS';
export const FETCH_ARTISAN_BY_ID_FAILURE = 'FETCH_ARTISAN_BY_ID_FAILURE';


export const fetchArtisans = () => async (dispatch) => {
  try {
      dispatch({ type: FETCH_ARTISANS_REQUEST });

      // Remplacez l'URL par l'URL de votre API pour obtenir la liste des artisans
      const response = await axios.get('http://127.0.0.1:8000/api/artisans');

      dispatch({
          type: FETCH_ARTISANS_SUCCESS,
          payload: response.data,
      });
  } catch (error) {
      dispatch({
          type: FETCH_ARTISANS_FAILURE,
          payload: error.response ? error.response.data : error.message,
      });
  }
};

// Action pour ajouter un artisan
export const addArtisan = (artisanData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: CREATE_ARTISAN_REQUEST });

      const formData = new FormData();
      formData.append('prenom', artisanData.prenom);
      formData.append('nom', artisanData.nom);
      formData.append('email', artisanData.email);
      formData.append('password', artisanData.password);
      formData.append('téléphone', artisanData.téléphone);
      formData.append('atélier', artisanData.atélier);
      formData.append('addréss', artisanData.addréss);
      formData.append('region', artisanData.region);
      formData.append('metier', artisanData.metier);

      if (artisanData.image) {
        formData.append('image', artisanData.image[0]);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/artisans", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      dispatch({
        type: CREATE_ARTISAN_SUCCESS,
        payload: response.data,
      });
      dispatch(fetchArtisans());
    } catch (error) {
      dispatch({
        type: CREATE_ARTISAN_FAILURE,
        payload: error.response ? error.response.data : error.message,
    });
    }
  };
};

export const updateArtisan = (id, formData) => async (dispatch) => {
  try {
      dispatch({ type: UPDATE_ARTISAN_REQUEST });
      console.log('ID de l\'artisan dans updateArtisan :', id);
      console.log('FormData envoyé à updateArtisan :', formData);
      const response = await axios.post(`http://127.0.0.1:8000/api/artisans/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch({
          type: UPDATE_ARTISAN_SUCCESS,
          payload: response.data.artisan,
      });

      dispatch({
        type: UPDATE_ARTISAN_SUCCESS,
        payload: response.data.artisan,
      });
  } catch (error) {
      dispatch({
          type: UPDATE_ARTISAN_FAILURE,
          payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
  }
};

// Action pour supprimer un artisan
export const deleteArtisan = (id) => async (dispatch) => {
  try {
      dispatch({ type: DELETE_ARTISAN_REQUEST });

      // Remplacez l'URL par l'URL de votre API
      await axios.delete(`http://127.0.0.1:8000/api/artisans/${id}`);

      dispatch({
          type: DELETE_ARTISAN_SUCCESS,
          payload: id, // ID de l'artisan supprimé
      });

      // Dispatch fetchArtisans after successful deletion
      dispatch(fetchArtisans());
  } catch (error) {
      dispatch({
          type: DELETE_ARTISAN_FAILURE,
          payload: error.response ? error.response.data : error.message,
      });
  }
};

export const assignRoleAndDetails = (artisanId, roleId, description, conseil) => {
  return async (dispatch) => {

    if (!artisanId) {
      console.error('artisanId is not defined');
      return;
    }

    const data = {
      roleId,
      description,
      conseil
    };

    try {
      const response = await axiosInstance.post(`/artisans/${artisanId}/assign`, data);
      if (response.status === 200) {
        dispatch({ type: 'ASSIGN_ARTISAN', payload: { id: artisanId, roleId, description, conseil } });
        dispatch(fetchArtisans()); 
      } else {
        // Gérer l'erreur si nécessaire
        console.error('Failed to assign role and details:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
      // Gérer l'erreur si nécessaire
    }
  };
};


/*export const fetchArtisan = (id) => {
  return async (dispatch) => {
      try {
          const response = await axios.get(`http://127.0.0.1:8000/api/artisans/${id}`);

          if (response.data.status === 200) {
              dispatch({
                  type: 'FETCH_ARTISAN',
                  payload: response.data.artisan
              });
          } else {
              // Gérer l'erreur si nécessaire
          }
      } catch (error) {
          console.error('Erreur lors de la requête API', error);
          // Gérer l'erreur si nécessaire
      }
  };
};*/

export const fetchArtisan = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/artisans/${id}`);
    dispatch({
      type: FETCH_ARTISAN_BY_ID_SUCCESS,
      payload: response.data.artisan,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ARTISAN_BY_ID_FAILURE,
      payload: error.message,
    });
  }
};

export const updateArtisanAccess = (id, access) => async dispatch => {
  dispatch({ type: UPDATE_ARTISAN_ACCESS_REQUEST });

  try {
    await axios.patch(`http://127.0.0.1:8000/api/artisans/access/${id}`, { access });

    dispatch({
      type: UPDATE_ARTISAN_ACCESS_SUCCESS,
      payload: { id, access }
    });
    dispatch(fetchArtisans());
  } catch (error) {
    dispatch({
      type: UPDATE_ARTISAN_ACCESS_FAILURE,
      payload: error.response ? error.response.data.error : 'Erreur inconnue'
    });
  }
};


