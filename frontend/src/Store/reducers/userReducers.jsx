// reducers/userReducers.js
const initialState = {
    users: [],
    user: {},
    loading: false,
    error: null,
    fetchCountUser: 0
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_USERS_SUCCESS':
        return {
          ...state,
          users: action.payload,
          loading: false,
          error: null,
          fetchCountUser: state.fetchCountUser + 1
        };
        case 'FETCH_USER_DETAILS_REQUEST':
          return { ...state, loading: true };
        case 'FETCH_USER_DETAILS_SUCCESS':
          return { ...state, user: action.payload, loading: false };
        case 'FETCH_USER_DETAILS_FAILURE':
          return { ...state, error: action.payload, loading: false };
        case 'UPDATE_USER_SUCCESS':
        return {
            ...state,
            users: state.users.map(user =>
              user.id === action.payload.id ? action.payload : user
            ),
            loading: false,
            error: null,
      };  
      case 'FETCH_USERS_ERROR':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  