import axios from 'axios';

// Action Types
export const FETCH_AVIS_REQUEST = 'FETCH_AVIS_REQUEST';
export const FETCH_AVIS_SUCCESS = 'FETCH_AVIS_SUCCESS';
export const FETCH_AVIS_FAILURE = 'FETCH_AVIS_FAILURE';
export const CREATE_AVIS_REQUEST = 'CREATE_AVIS_REQUEST';
export const CREATE_AVIS_SUCCESS = 'CREATE_AVIS_SUCCESS';
export const CREATE_AVIS_FAILURE = 'CREATE_AVIS_FAILURE';
export const FETCH_NOTE_COUNT_REQUEST = 'FETCH_NOTE_COUNT_REQUEST';
export const FETCH_NOTE_COUNT_SUCCESS = 'FETCH_NOTE_COUNT_SUCCESS';
export const FETCH_NOTE_COUNT_FAILURE = 'FETCH_NOTE_COUNT_FAILURE';

const fetchNoteCountRequest = () => ({ type: FETCH_NOTE_COUNT_REQUEST });
const fetchNoteCountSuccess = (artisanId, noteCount) => ({
    type: FETCH_NOTE_COUNT_SUCCESS,
    payload: { artisanId, noteCount }
});
const fetchNoteCountFailure = (error) => ({
    type: FETCH_NOTE_COUNT_FAILURE,
    payload: error
});


const fetchAvisRequest = () => ({
  type: FETCH_AVIS_REQUEST,
});

const fetchAvisSuccess = (avis) => ({
  type: FETCH_AVIS_SUCCESS,
  payload: avis,
});

const fetchAvisFailure = (error) => ({
  type: FETCH_AVIS_FAILURE,
  payload: error,
});

export const createAvisRequest = () => ({
    type: CREATE_AVIS_REQUEST
});

const createAvisSuccess = (data) => ({
  type: CREATE_AVIS_SUCCESS,
  payload: data,
});

export const createAvisFailure = (error) => ({
    type: CREATE_AVIS_FAILURE,
    payload: error
});

// Thunk for fetching avis
export const fetchAvis = () => {
  return (dispatch) => {
    dispatch(fetchAvisRequest());
    axios
      .get('http://127.0.0.1:8000/api/avis') // Change this to your API endpoint
      .then((response) => {
        dispatch(fetchAvisSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchAvisFailure(error.message));
      });
  };
};

export const createAvis = (artisanId, newAvis) => {
    return (dispatch) => {
        dispatch(createAvisRequest());
        axios
            .post(`http://127.0.0.1:8000/api/avis/${artisanId}`, newAvis) // Votre endpoint API avec l'ID de l'artisan
            .then((response) => {
                dispatch(createAvisSuccess(response.data));
                // Peut-être que vous voulez mettre à jour les avis après création
                dispatch(fetchAvis(artisanId)); // Appeler fetchAvis avec l'ID de l'artisan
            })
            .catch((error) => {
                dispatch(createAvisFailure(error));
                console.error('Error adding avis:', error);
            });
    };
};

export const createRating = (artisanId, rating) => {
  return async (dispatch) => {
    dispatch(createAvisRequest());

    try {
      // Appel à l'API pour créer une note
      const response = await axios.post(`http://127.0.0.1:8000/api/rate/${artisanId}`, { artisan_id: artisanId, rating: rating });
      
      // Dispatcher la réussite de la création de la note
      dispatch(createAvisSuccess(response.data));
      
      // Récupérer le nombre de notes mis à jour pour l'artisan
      dispatch(fetchRatingCount(artisanId));
    } catch (error) {
      // Dispatcher l'échec de la création de la note
      dispatch(createAvisFailure(error));
      console.error('Error adding avis:', error);
    }
  };
};

export const fetchRatingCount = (artisanId) => {
  return async (dispatch) => {
    dispatch(fetchNoteCountRequest());
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/artisans/${artisanId}/rating-count`);
      dispatch(fetchNoteCountSuccess(artisanId, response.data.note_count));
      return response.data;
    } catch (error) {
      dispatch(fetchNoteCountFailure(error.message));
      throw error;
    }
  };
};
