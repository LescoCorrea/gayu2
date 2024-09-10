import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, LOGOUT_FAILURE, SET_USER } from '../../views/Auth/authActionTypes';

const initialState = {
  user: null,
  token: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        error: null,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SET_USER:
        return {
          ...state,
          user: action.payload,
          artisan: null,
        };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user || action.payload.artisan,
        token: action.payload.access_token,
        error: null,
      };   
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    case LOGOUT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
