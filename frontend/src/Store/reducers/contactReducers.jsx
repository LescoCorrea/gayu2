import {
    SEND_CONTACT_MESSAGE_REQUEST,
    SEND_CONTACT_MESSAGE_SUCCESS,
    SEND_CONTACT_MESSAGE_FAILURE
  } from '../../views/Pages/Components/contactAction';
  
  // État initial
  const initialState = {
    loading: false,
    message: '',
    error: ''
  };
  
  // Réducteur pour gérer l'état du message de contact
  const contactReducer = (state = initialState, action) => {
    switch (action.type) {
      case SEND_CONTACT_MESSAGE_REQUEST:
        return { ...state, loading: true, error: '' };
      case SEND_CONTACT_MESSAGE_SUCCESS:
        return { ...state, loading: false, message: action.payload };
      case SEND_CONTACT_MESSAGE_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default contactReducer;
  