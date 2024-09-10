import {
  FETCH_ARTISANS_REQUEST,
  FETCH_ARTISANS_SUCCESS,
  FETCH_ARTISANS_FAILURE,
  CREATE_ARTISAN_SUCCESS,
  CREATE_ARTISAN_REQUEST,
  CREATE_ARTISAN_FAILURE,
  DELETE_ARTISAN_SUCCESS,
  DELETE_ARTISAN_FAILURE,
  UPDATE_ARTISAN_REQUEST,
  UPDATE_ARTISAN_SUCCESS,
  UPDATE_ARTISAN_FAILURE,
  UPDATE_ARTISAN_ACCESS_REQUEST,
  UPDATE_ARTISAN_ACCESS_SUCCESS,
  UPDATE_ARTISAN_ACCESS_FAILURE,
  GET_ACCESS_REQUEST,
  GET_ACCESS_SUCCESS,
  GET_ACCESS_FAILURE,
  FETCH_ARTISAN_BY_ID_SUCCESS,
   FETCH_ARTISAN_BY_ID_FAILURE
} from '../../views/Dashboard/Admin/Components/Pages/actions/artisanActions';
import {
  CREATE_AVIS_SUCCESS,
  FETCH_NOTE_COUNT_REQUEST,
  FETCH_NOTE_COUNT_SUCCESS,
  FETCH_NOTE_COUNT_FAILURE,
} from '../../views/Pages/Artisans/actions/AvisActions'
import {
  UPDATE_ARTISAN_PROFILE_SUCCESS,
  UPDATE_ARTISAN_IMAGE_SUCCESS,
  UPDATE_ARTISAN_STATUS
} from '../../views/Dashboard/Artisan/Components/Actions/artisanActions'

const initialState = {
    artisans: [],
    loading: false,
    artisan: null,
    fetchCountArtisan: 0,
    updateAccessLoading: false,
    updateAccessError: null,
    ratings: {},
  };
  
  const artisanReducers = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ARTISANS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_ARTISANS_SUCCESS:
            return {
                loading: false,
                artisans: action.payload.artisans,
                fetchCountArtisan: state.fetchCountArtisan + 1,
                ratings: action.payload.ratings || state.ratings,
                error: null,
            };
        case FETCH_ARTISANS_FAILURE:
            return {
                loading: false,
                artisans: [],
                error: action.payload,
            };
            case FETCH_ARTISAN_BY_ID_SUCCESS:
              return {
                ...state,
                artisan: action.payload,
                error: null,
              };
            case FETCH_ARTISAN_BY_ID_FAILURE:
              return {
                ...state,
                artisan: null,
                error: action.payload,
              };
      case 'FETCH_ARTISAN_DETAILS':
          return {
            ...state,
            artisanDetails: action.payload
          }; 
      case CREATE_ARTISAN_REQUEST:
            return {
                ...state,
                loading: true,
            };    
      case CREATE_ARTISAN_SUCCESS:
          return {
              loading: false,
              artisans: [...state.artisans, action.payload.artisan],
              error: null,
          };
      case CREATE_ARTISAN_FAILURE:
          return {
              loading: false,
              artisan: null,
              error: action.payload,
          };
      
          case CREATE_AVIS_SUCCESS:
          {
            const { artisan_id, rating } = action.payload;
            return {
              ...state,
              loading: false,
              ratings: {
                ...state.ratings,
                [artisan_id]: (state.ratings[artisan_id] || 0) + rating,
              },
              error: null,
            };
          }
            case FETCH_NOTE_COUNT_REQUEST:
            return { ...state, loading: true };
          case FETCH_NOTE_COUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                ratings: {
                    ...state.ratings,
                    [action.payload.artisanId]: action.payload.noteCount
                },
                error: null
            };
          case FETCH_NOTE_COUNT_FAILURE:
            return { ...state, loading: false, error: action.payload };
      case UPDATE_ARTISAN_SUCCESS:
          return {
              ...state,
              loading: false,
              artisans: state.artisans.map((artisan) =>
                 artisan.id === action.payload.id ? action.payload : artisan
              ),
              error: null,
          };
          case UPDATE_ARTISAN_PROFILE_SUCCESS:
            return { ...state, artisan: { ...state.artisan, ...action.payload }
          };
      case DELETE_ARTISAN_SUCCESS:
            return {
              ...state,
              loading: false,
              artisans: state.artisans.filter(artisan => artisan.id !== action.payload),
              error: null,
      };
      case DELETE_ARTISAN_FAILURE:
            return {
              ...state,
              loading: false,
              error: action.payload,
      };
        case 'ASSIGN_ARTISAN':
          return {
            ...state,
            artisans: state.artisans.map(artisan =>
              artisan.id === action.payload.id
                ? { ...artisan, roleId: action.payload.roleId, description: action.payload.description, conseil: action.payload.conseil }
                : artisan
            )
        };
        case UPDATE_ARTISAN_REQUEST:
          return {
              ...state,
              loading: true,
        };  
        case UPDATE_ARTISAN_STATUS:
            return {
                ...state,
                artisans: state.artisans.map(artisan =>
                    artisan.id === action.payload.id ? { ...artisan, status: action.payload.status } : artisan
                ),
            };
          case UPDATE_ARTISAN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }; 
            case UPDATE_ARTISAN_ACCESS_REQUEST:
              return {
                ...state,
                updateAccessLoading: true,
                updateAccessError: null,
              };
          case UPDATE_ARTISAN_ACCESS_SUCCESS:
              return {
                ...state,
                updateAccessLoading: false,
                artisans: state.artisans.map(artisan =>
                  artisan.id === action.payload.artisan.id ? action.payload.artisan : artisan
                ),
                updateAccessError: null,
              };
          case UPDATE_ARTISAN_IMAGE_SUCCESS:
                return {
                  ...state,
                  artisan: {
                    ...state.artisan,
                    image: action.payload.image, // updating the image in the state
                  },
                  loading: false,
                };
          case UPDATE_ARTISAN_ACCESS_FAILURE:
              return {
                ...state,
                updateAccessLoading: false,
                updateAccessError: action.payload,
              }; 
          case GET_ACCESS_REQUEST:
                return {
                  ...state,
                  loading: true,
                  error: null,
              };
          case GET_ACCESS_SUCCESS:
                return {
                  ...state,
                  loading: false,
                  access: action.payload,
              };
          case GET_ACCESS_FAILURE:
                return {
                  ...state,
                  loading: false,
                  error: action.payload,
              };

      default:
        return state;
    }
  };

  export default artisanReducers;
  