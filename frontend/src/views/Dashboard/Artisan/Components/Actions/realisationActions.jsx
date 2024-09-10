import axios from 'axios';

export const ADD_REALISATION_REQUEST = 'ADD_REALISATION_REQUEST';
export const ADD_REALISATION_SUCCESS = 'ADD_REALISATION_SUCCESS';
export const ADD_REALISATION_FAILURE = 'ADD_REALISATION_FAILURE';
export const FETCH_REALISATIONS_REQUEST = 'FETCH_REALISATIONS_REQUEST';
export const FETCH_REALISATIONS_SUCCESS = 'FETCH_REALISATIONS_SUCCESS';
export const FETCH_REALISATIONS_FAILURE = 'FETCH_REALISATIONS_FAILURE';
export const DELETE_REALISATION_REQUEST = 'DELETE_REALISATION_REQUEST';
export const DELETE_REALISATION_SUCCESS = 'DELETE_REALISATION_SUCCESS';
export const DELETE_REALISATION_FAILURE = 'DELETE_REALISATION_FAILURE';
export const UPDATE_REALISATION_REQUEST = 'UPDATE_REALISATION_REQUEST';
export const UPDATE_REALISATION_SUCCESS = 'UPDATE_REALISATION_SUCCESS';
export const UPDATE_REALISATION_FAILURE = 'UPDATE_REALISATION_FAILURE';
export const SHOW_REALISATION_REQUEST = 'SHOW_REALISATION_REQUEST';
export const SHOW_REALISATION_SUCCESS = 'SHOW_REALISATION_SUCCESS';
export const SHOW_REALISATION_FAILURE = 'SHOW_REALISATION_FAILURE';


export const fetchRealisations = () => async (dispatch) => {
  dispatch({ type: 'FETCH_REALISATIONS_REQUEST' });
  try {
      const response = await axios.get('http://127.0.0.1:8000/api/realisations'); // Remplace par l'URL appropriée
      dispatch({
          type: 'FETCH_REALISATIONS_SUCCESS',
          payload: response.data.realisations,
      });
  } catch (error) {
      dispatch({
          type: 'FETCH_REALISATIONS_FAILURE',
          payload: error.message,
      });
  }
};

export const addRealisation = (formData) => async (dispatch) => {
  dispatch({ type: ADD_REALISATION_REQUEST });

  try {
      const response = await axios.post('http://127.0.0.1:8000/api/realisations', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          }
      });
      dispatch({
          type: ADD_REALISATION_SUCCESS,
          payload: response.data,
      });
      dispatch(fetchRealisations());
  } catch (error) {
      dispatch({
          type: ADD_REALISATION_FAILURE,
          payload: error.response ? error.response.data : { error: 'Erreur de connexion.' },
      });
  }
};


export const showRealisation = (id) => async (dispatch) => {
  dispatch({ type: SHOW_REALISATION_REQUEST });
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/realisations/${id}`);
    dispatch({
      type: SHOW_REALISATION_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: SHOW_REALISATION_FAILURE,
      payload: error.response ? error.response.data : { error: 'Erreur de connexion.' },
    });
  }
};

export const updateRealisation = (id, formData) => async dispatch => {
  try {
      console.log('FormData envoyé à updateRealisation :', formData);
      const response = await axios.post(`http://127.0.0.1:8000/api/realisations/${id}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      dispatch({
          type: 'UPDATE_REALISATION_SUCCESS',
          payload: response.data.realisation,
      });
      dispatch(fetchRealisations());
      console.log('réponse API :', response);
  } catch (error) {
      console.error('Erreur lors de la modification de la réalisation :', error);
      throw error;
  }
};

export const deleteRealisation = (id) => async (dispatch) => {
  dispatch({ type: DELETE_REALISATION_REQUEST });

  try {
    const response = await axios.delete(`http://127.0.0.1:8000/api/realisations/${id}`);
    dispatch({
      type: DELETE_REALISATION_SUCCESS,
      payload: response.data,
    });
    dispatch(fetchRealisations());
  } catch (error) {
    dispatch({
      type: DELETE_REALISATION_FAILURE,
      payload: error.response.data,
    });
  }
};