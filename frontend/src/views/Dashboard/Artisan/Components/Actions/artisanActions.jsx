import axios from 'axios';
export const UPDATE_ARTISAN_PROFILE_SUCCESS = 'UPDATE_ARTISAN_PROFILE_SUCCESS';
export const UPDATE_ARTISAN_IMAGE_SUCCESS = 'UPDATE_ARTISAN_IMAGE_SUCCESS';
export const UPDATE_ARTISAN_STATUS = 'UPDATE_ARTISAN_IMAGE_SUCCESS';

export const fetchArtisanDetails = () => {
    return async (dispatch) => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/artisan/profil");
  
        if (response.data.status === 200) {
          dispatch({
            type: 'FETCH_ARTISAN_DETAILS',
            payload: response.data.artisan
          });
        } else {
          // Gérer l'erreur si nécessaire
        }
      } catch (error) {
        console.error('Error during API request', error);
        // Gérer l'erreur si nécessaire
      }
    };
};

export const updateArtisanStatus = (newStatus) => async (dispatch) => {
  try {
      const response = await axios.put('http://localhost:8000/api/artisan/status', { status: newStatus });
      dispatch({
          type: UPDATE_ARTISAN_STATUS,
          payload: response.data,
      });
  } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
  }
};

export const updateArtisanProfile = (artisanData) => async (dispatch) => {
  try {
    const response = await axios.put('http://127.0.0.1:8000/api/artisan/profile', artisanData);
    dispatch({ type: UPDATE_ARTISAN_PROFILE_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
  }
};

export const updateArtisanImage = (formData) => async (dispatch) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/artisan/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: 'UPDATE_ARTISAN_IMAGE_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'UPDATE_ARTISAN_IMAGE_FAIL',
      payload: error.response ? error.response.data : { message: 'Une erreur est survenue.' },
    });
  }
};
