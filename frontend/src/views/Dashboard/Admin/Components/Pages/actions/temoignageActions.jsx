import axios from 'axios';

// Définir les types d'action
export const FETCH_TEMOIGNAGES_SUCCESS = 'FETCH_TEMOIGNAGES_SUCCESS';
export const FETCH_TEMOIGNAGES_FAILURE = 'FETCH_TEMOIGNAGES_FAILURE';

export const ADD_TEMOIGNAGE_SUCCESS = 'ADD_TEMOIGNAGE_SUCCESS';
export const ADD_TEMOIGNAGE_FAILURE = 'ADD_TEMOIGNAGE_FAILURE';

export const UPDATE_TEMOIGNAGE_SUCCESS = 'UPDATE_TEMOIGNAGE_SUCCESS';
export const UPDATE_TEMOIGNAGE_FAILURE = 'UPDATE_TEMOIGNAGE_FAILURE';

export const DELETE_TEMOIGNAGE_SUCCESS = 'DELETE_TEMOIGNAGE_SUCCESS';
export const DELETE_TEMOIGNAGE_FAILURE = 'DELETE_TEMOIGNAGE_FAILURE';

// Action pour récupérer tous les témoignages
export const fetchTemoignages = () => async dispatch => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/temoignages');
        dispatch({
            type: FETCH_TEMOIGNAGES_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_TEMOIGNAGES_FAILURE,
            payload: error.message
        });
    }
};

// Action pour ajouter un témoignage
export const addTemoignage = (temoignageData) => async dispatch => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/temoignages', temoignageData);
        dispatch({
            type: ADD_TEMOIGNAGE_SUCCESS,
            payload: response.data
        });
        dispatch(fetchTemoignages());
    } catch (error) {
        dispatch({
            type: ADD_TEMOIGNAGE_FAILURE,
            payload: error.message
        });
    }
};

// Action pour mettre à jour un témoignage
export const updateTemoignage = (id, temoignageData) => async dispatch => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/temoignages/${id}`, temoignageData);
        dispatch({
            type: UPDATE_TEMOIGNAGE_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_TEMOIGNAGE_FAILURE,
            payload: error.message
        });
    }
};

// Action pour supprimer un témoignage
export const deleteTemoignage = (id) => async dispatch => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/temoignages/${id}`);
        dispatch({
            type: DELETE_TEMOIGNAGE_SUCCESS,
            payload: id
        });
    } catch (error) {
        dispatch({
            type: DELETE_TEMOIGNAGE_FAILURE,
            payload: error.message
        });
    }
};
