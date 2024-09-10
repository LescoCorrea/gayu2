import axios from 'axios';
import Cookies from 'js-cookie';
import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, UPDATE_PROFILE_SUCCESS,FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILURE , UPDATE_PROFILE_FAILURE } from './authActionTypes';
import Swal from 'sweetalert2';

export const register = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });

    Cookies.set('token', response.data.access_token, { expires: 7 });
    
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.message });
  }
};

export const login = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', userData);
    console.log('Login response:', response.data);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });

    Cookies.set('token', response.data.access_token, { expires: 7 });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);

    // Gestion spécifique pour les artisans
    if (error.response?.status === 403) {
      Swal.fire({
        title: 'Erreur',
        text: 'L\'accès à votre compte est refusé. Veuillez contacter l\'administrateur.',
      });
    } else {
      // Gestion des erreurs pour les utilisateurs normaux
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes('Email incorrect')) {
        dispatch({ type: LOGIN_FAILURE, payload: 'Email incorrect' });
      } else if (errorMessage.includes('Mot de passe incorrect')) {
        dispatch({ type: LOGIN_FAILURE, payload: 'Mot de passe incorrect' });
      } else {
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
      }
    }
  }
};

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
});

export const updateProfile = (userData) => async (dispatch) => {
  try {
    const response = await axios.put('http://127.0.0.1:8000/api/profile', userData);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error.message });
  }
};

export const fetchUserDetails = () => async (dispatch) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/user/profil');
    dispatch({ type: FETCH_USER_DETAILS_SUCCESS, payload: response.data.user });
  } catch (error) {
    dispatch({ type: FETCH_USER_DETAILS_FAILURE, payload: error.message });
  }
};

/*export const setArtisan = (artisan) => {
  return {
    type: 'SET_USER',
    payload: artisan,
  };
};*/

export const setLogout = () => async (dispatch) => {
  try {
    // Supprime le cookie contenant le token
    Cookies.remove('token');

    // Ajoutez d'autres logiques de déconnexion si nécessaire, comme vider le state auth
    dispatch({ type: 'LOGOUT_SUCCESS' }); // Exemple de type d'action pour la déconnexion réussie
  } catch (error) {
    dispatch({ type: 'LOGOUT_FAILURE', payload: error.message }); // Gérer les erreurs de déconnexion si nécessaire
  }
};