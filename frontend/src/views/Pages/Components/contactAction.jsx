import axios from 'axios';

// Définir les types d'actions
export const SEND_CONTACT_MESSAGE_REQUEST = 'SEND_CONTACT_MESSAGE_REQUEST';
export const SEND_CONTACT_MESSAGE_SUCCESS = 'SEND_CONTACT_MESSAGE_SUCCESS';
export const SEND_CONTACT_MESSAGE_FAILURE = 'SEND_CONTACT_MESSAGE_FAILURE';

// Action pour envoyer le message de contact
export const sendContactMessage = (contactData) => async (dispatch) => {
  dispatch({ type: SEND_CONTACT_MESSAGE_REQUEST });

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/contact', contactData);
    dispatch({ type: SEND_CONTACT_MESSAGE_SUCCESS, payload: response.data.message });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi du message.';
    dispatch({ type: SEND_CONTACT_MESSAGE_FAILURE, payload: errorMessage });
  }
};
