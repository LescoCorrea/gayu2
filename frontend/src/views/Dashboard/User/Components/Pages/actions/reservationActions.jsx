import axios from 'axios';
import { toast } from 'react-toastify';
export const FETCH_RESERVATIONS_SUCCESS = 'FETCH_RESERVATIONS_SUCCESS';
export const FETCH_RESERVATIONS_FAILURE = 'FETCH_RESERVATIONS_FAILURE';
export const CREATE_RESERVATION_SUCCESS = 'CREATE_RESERVATION_SUCCESS';
export const CREATE_RESERVATION_FAILURE = 'CREATE_RESERVATION_FAILURE';
export const UPDATE_RESERVATION_SUCCESS = 'UPDATE_RESERVATION_SUCCESS';
export const UPDATE_RESERVATION_FAILURE = 'UPDATE_RESERVATION_FAILURE';
export const DELETE_RESERVATION_SUCCESS = 'DELETE_RESERVATION_SUCCESS';
export const DELETE_RESERVATION_FAILURE = 'DELETE_RESERVATION_FAILURE';
export const FETCH_RESERVATIONS_ARTISAN_SUCCESS = 'FETCH_RESERVATIONS_ARTISAN_SUCCESS';
export const FETCH_RESERVATIONS_ARTISAN_FAILURE = 'FETCH_RESERVATIONS_ARTISAN_FAILURE';
export const EDIT_RESERVATION_SUCCESS = 'EDIT_RESERVATION_SUCCESS';
export const FETCH_RESERVATIONS_REQUEST = 'FETCH_RESERVATIONS_REQUEST';
export const EDIT_RESERVATION_FAILURE = 'EDIT_RESERVATION_FAILURE';

export const fetchReservations = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_RESERVATIONS_REQUEST })
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reservations');
      dispatch({ type: FETCH_RESERVATIONS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_RESERVATIONS_FAILURE, payload: error.message });
    }
  };
};

// Action pour récupérer les réservations de l'artisan
export const fetchReservationsArtisan = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reservations-artisan');
      //console.log("Réponse de la requête :", response);
      dispatch({ type: FETCH_RESERVATIONS_ARTISAN_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_RESERVATIONS_ARTISAN_FAILURE, payload: error.message });
    }
  };
};

export const createReservation = (reservationData) => {
  return async (dispatch) => {
    try {
      console.log("ID de l'artisan:", reservationData.get('artisanId'));
      const artisanId = reservationData.get('artisanId');
      const response = await axios.post(`http://127.0.0.1:8000/api/reservations/${artisanId}`, reservationData);
      dispatch({ type: CREATE_RESERVATION_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: CREATE_RESERVATION_FAILURE, payload: error.message });
    }
  };
};

export const updateReservation = (id, formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/reservations/${id}`, formData, {  
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({ type: UPDATE_RESERVATION_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: UPDATE_RESERVATION_FAILURE, payload: error.message });
    }
  };
};

export const deleteReservation = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/reservations/${id}`);
      dispatch({ type: DELETE_RESERVATION_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: DELETE_RESERVATION_FAILURE, payload: error.message });
    }
  };
};

export const editReservation = (id, updatedReservation) => async dispatch => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/reservations/${id}`, updatedReservation);
    dispatch({ type: 'EDIT_RESERVATION_SUCCESS', payload: response.data });
    toast.success('Réservation modifiée avec succès');
  } catch (error) {
    dispatch({ type: 'EDIT_RESERVATION_FAILURE', payload: error.message });
    toast.error('Erreur lors de la modification de la réservation');
  }
};
