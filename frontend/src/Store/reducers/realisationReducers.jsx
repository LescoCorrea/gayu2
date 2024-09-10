import {
  ADD_REALISATION_REQUEST,
  ADD_REALISATION_SUCCESS,
  ADD_REALISATION_FAILURE,
  FETCH_REALISATIONS_REQUEST,
  FETCH_REALISATIONS_SUCCESS,
  FETCH_REALISATIONS_FAILURE,
  DELETE_REALISATION_REQUEST,
  DELETE_REALISATION_SUCCESS,
  DELETE_REALISATION_FAILURE,
  SHOW_REALISATION_REQUEST,
  SHOW_REALISATION_SUCCESS,
  SHOW_REALISATION_FAILURE,
  UPDATE_REALISATION_REQUEST,
  UPDATE_REALISATION_SUCCESS,
  UPDATE_REALISATION_FAILURE
} from '../../views/Dashboard/Artisan/Components/Actions/realisationActions';

import {
    LIKE_REALISATION_REQUEST, 
    LIKE_REALISATION_SUCCESS, 
    LIKE_REALISATION_FAILURE, 
    UNLIKE_REALISATION_REQUEST, 
    UNLIKE_REALISATION_SUCCESS, 
    UNLIKE_REALISATION_FAILURE ,
    FETCH_AIME_COUNT_REQUEST,
    FETCH_AIME_COUNT_SUCCESS,
    SET_LIKE_COUNT, 
    SET_LIKE_ERROR,
} from '../../views/Pages/Artisans/actions/LikeActions';

const initialState = {
  loading: false,
  realisation: null,
  realisations: [],
  error: null,
  likeCounts: {},
};

const realisationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REALISATIONS_REQUEST:
        return { 
          ...state,
          loading: true 
        };
    case ADD_REALISATION_REQUEST:
          return {
            ...state,
            loading: true,
          }; 
    case SHOW_REALISATION_REQUEST:
        return {
          ...state,
          loading: true,
      };
    case FETCH_AIME_COUNT_REQUEST:
            return { ...state, loading: true };
    case UPDATE_REALISATION_REQUEST:
        return { 
          ...state, 
          loading: true 
        };
    case DELETE_REALISATION_REQUEST:
        return { ...state, loading: true };      
    case FETCH_REALISATIONS_SUCCESS:
        return { 
          ...state,
          loading: false,
          realisations: action.payload 
        };
    case FETCH_REALISATIONS_FAILURE:
        return { 
          ...state,
          loading: false,
          error: action.payload 
        };
        case SET_LIKE_COUNT:
          return {
              ...state,
              likeCounts: {
                  ...state.likeCounts,
                  [action.payload.id]: action.payload.count
              }
          };
    case ADD_REALISATION_SUCCESS:
      return {
        ...state,
        loading: false,
        realisation: action.payload.realisation,
      };
    case ADD_REALISATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case SHOW_REALISATION_SUCCESS:
        return {
          ...state,
          loading: false,
          realisation: action.payload,
        };
    case SHOW_REALISATION_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload,
          };
    case UPDATE_REALISATION_SUCCESS:
       console.log('UPDATE_REALISATION_SUCCESS:', action.payload);
        return {
              ...state,
              loading: false,
              realisations: state.realisations.map(realisation =>
                realisation.id === action.payload.id ? action.payload : realisation
              ),
          };
    case UPDATE_REALISATION_FAILURE:
      console.log('UPDATE_REALISATION_FAILURE:', action.payload.error);
        return {
          ...state,
          loading: false,
          error: action.payload.error,
      };  
    case DELETE_REALISATION_SUCCESS:
        return {
          ...state,
          loading: false,
          realisations: state.realisations.filter(realisation => realisation.id !== action.payload.id),
        };
    case DELETE_REALISATION_FAILURE:
        return { ...state, loading: false, error: action.payload.error };
        case LIKE_REALISATION_REQUEST:
        case UNLIKE_REALISATION_REQUEST:
          return {
              ...state,
              loading: true,
              error: null,
          };
      case LIKE_REALISATION_SUCCESS:
        return {
          ...state,
          likeCounts: {
            ...state.likeCounts,
            [action.payload]: (state.likeCounts[action.payload] || 0) + 1,
          },
        };
      case UNLIKE_REALISATION_SUCCESS:
        return {
          ...state,
          likeCounts: {
            ...state.likeCounts,
            [action.payload]: (state.likeCounts[action.payload] || 0) - 1,
          },
        };
      case LIKE_REALISATION_FAILURE:
      case UNLIKE_REALISATION_FAILURE:
          return {
              ...state,
              loading: false,
              error: action.payload.error,
          };
          case FETCH_AIME_COUNT_SUCCESS:
              return { 
                  ...state, 
                  loading: false, 
                  likeCounts: { 
                      ...state.likeCounts, 
                      [action.payload.id]: action.payload.count 
                  } 
              };
          case SET_LIKE_ERROR:
                return {
                  ...state,
                  error: action.payload,
                };
    default:
      return state;
  }
};

export default realisationReducer;
