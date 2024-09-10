// realisationActions.js
import axios from 'axios';

export const LIKE_REALISATION_REQUEST = 'LIKE_REALISATION_REQUEST';
export const LIKE_REALISATION_SUCCESS = 'LIKE_REALISATION_SUCCESS';
export const LIKE_REALISATION_FAILURE = 'LIKE_REALISATION_FAILURE';

export const UNLIKE_REALISATION_REQUEST = 'UNLIKE_REALISATION_REQUEST';
export const UNLIKE_REALISATION_SUCCESS = 'UNLIKE_REALISATION_SUCCESS';
export const UNLIKE_REALISATION_FAILURE = 'UNLIKE_REALISATION_FAILURE';

export const FETCH_AIME_COUNT_REQUEST = 'FETCH_AIME_COUNT_REQUEST';
export const FETCH_AIME_COUNT_SUCCESS = 'FETCH_AIME_COUNT_SUCCESS';
export const FETCH_AIME_COUNT_FAILURE = 'FETCH_AIME_COUNT_FAILURE';
export const SET_LIKE_COUNT = 'SET_LIKE_COUNT';
export const SET_LIKE_ERROR = 'SET_LIKE_ERROR';


// Action Creator pour liker ou unliker une réalisation
export const likeRealisation = (realisationId) => async (dispatch) => {
    dispatch({ type: LIKE_REALISATION_REQUEST });
    try {
        await axios.post(`http://127.0.0.1:8000/api/realisations/${realisationId}/like`);
        dispatch({ type: LIKE_REALISATION_SUCCESS, payload: realisationId });
        dispatch(fetchLikeCount(realisationId));
    } catch (error) {
        console.error('Erreur lors de l\'ajout du like', error);
    }
};

export const unlikeRealisation = (realisationId) => async (dispatch) => {
    dispatch({ type: LIKE_REALISATION_REQUEST });
    try {
        await axios.delete(`http://127.0.0.1:8000/api/realisations/${realisationId}/like`);
        dispatch({ type: UNLIKE_REALISATION_SUCCESS, payload: realisationId });
        dispatch(fetchLikeCount(realisationId));
    } catch (error) {
        console.error('Erreur lors de la suppression du like', error);
    }
};

export const fetchLikeCount = (realisationId) => async dispatch => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/realisations/${realisationId}/aime`);
      dispatch({ type: SET_LIKE_COUNT, payload: { id: realisationId, count: response.data.count } });
    } catch (error) {
      dispatch({ type: SET_LIKE_ERROR, payload: error.message });
    }
};