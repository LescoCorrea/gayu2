import {
    FETCH_AVIS_REQUEST,
    FETCH_AVIS_SUCCESS,
    FETCH_AVIS_FAILURE,
    CREATE_AVIS_REQUEST, CREATE_AVIS_SUCCESS, CREATE_AVIS_FAILURE
  } from '../../views/Pages/Artisans/actions/AvisActions';
  
const initialState = {
    loading: false,
    avis: [],
    error: '',
};
  
const avisReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_AVIS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_AVIS_SUCCESS:
        return {
          loading: false,
          avis: action.payload,
          error: '',
        };
      case FETCH_AVIS_FAILURE:
        return {
          loading: false,
          avis: [],
          error: action.payload,
        };
        case CREATE_AVIS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case CREATE_AVIS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                avis: [...state.avis, action.payload]
            };
        case CREATE_AVIS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
      default:
        return state;
    }
};
  
export default avisReducer;
  