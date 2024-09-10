import {
    FETCH_RESERVATIONS_SUCCESS,
    FETCH_RESERVATIONS_FAILURE,
    CREATE_RESERVATION_SUCCESS,
    CREATE_RESERVATION_FAILURE,
    UPDATE_RESERVATION_FAILURE,
    DELETE_RESERVATION_SUCCESS,
    DELETE_RESERVATION_FAILURE,
    FETCH_RESERVATIONS_ARTISAN_SUCCESS,
    FETCH_RESERVATIONS_ARTISAN_FAILURE,
    EDIT_RESERVATION_SUCCESS,
    FETCH_RESERVATIONS_REQUEST
} from '../../views/Dashboard/User/Components/Pages/actions/reservationActions';
import {
  UPDATE_RESERVATION_STATUS
} from '../../views/Dashboard/Artisan/Components/Actions/reservationsActions'
  
  const initialState = {
    reservations: [],
    error: null,
    loading: false,
    fetchCountReservation: 0
  };
  const reservationReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_RESERVATIONS_REQUEST:  // Début du chargement
      return {
        ...state,
        loading: true,  // Définir loading à true
      };
      case FETCH_RESERVATIONS_SUCCESS:
        return {
          ...state,
          reservations: action.payload,
          error: null,
          loading: false,
        };
      case FETCH_RESERVATIONS_FAILURE:
        return {
          ...state,
          reservations: [],
          fetchCountReservation: state.fetchCountReservation + 1,
          loading: false,
          error: action.payload,
        };
        case FETCH_RESERVATIONS_ARTISAN_SUCCESS: // Ajoutez ce cas pour gérer FETCH_RESERVATIONS_ARTISAN_SUCCESS
        return {
          ...state,
          reservations: action.payload,
          error: null,
          loading: false,
        };
      case FETCH_RESERVATIONS_ARTISAN_FAILURE: // Ajoutez ce cas pour gérer FETCH_RESERVATIONS_ARTISAN_FAILURE
        return {
          ...state,
          reservations: [],
          error: action.payload,
          loading: false,
        };  
      case CREATE_RESERVATION_SUCCESS:
        return {
          ...state,
          reservations: [...state.reservations, action.payload],
          error: null,
          loading: false,
        };
      case CREATE_RESERVATION_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case EDIT_RESERVATION_SUCCESS:
          return {
            ...state,
            reservations: state.reservations.map(reservation =>
              reservation.id === action.payload.id ? action.payload : reservation
            ),
            loading: false,
          };
      case UPDATE_RESERVATION_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
        case UPDATE_RESERVATION_STATUS:
          return {
              ...state,
              reservations: state.reservations.map((reservation) =>
                  reservation.id === action.payload.id ? action.payload : reservation
              ),
              loading: false,
          };
      case DELETE_RESERVATION_SUCCESS:
        // Logic to remove deleted reservation from state
        return {
          ...state,
          reservations: state.reservations.filter((reservation) => reservation.id !== action.payload),
          error: null,
          loading: false,
        };   
      case DELETE_RESERVATION_FAILURE:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
        
      default:
        return state;
    }
  };
  
  export default reservationReducer;
  