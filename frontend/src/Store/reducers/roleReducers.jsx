const initialState = {
    roles: [],
    fetchCountRole: 0
  };
  
  const roleReducers = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_ROLE':
        return {
          ...state,
          roles: [...state.roles, action.payload]
        };
      case 'UPDATE_ROLE':
        return {
          ...state,
          roles: state.roles.map(role =>
            role.id === action.payload.id ? action.payload : role
          )
        };
      case 'DELETE_ROLE':
        return {
          ...state,
          roles: state.roles.filter(role => role.id !== action.payload)
        };
      case 'FETCH_ROLES':
        //console.log("Nouvelles rôles:", action.payload);
        return {
          ...state,
          roles: action.payload,
          fetchCountRole: state.fetchCountRole + 1
        };
      default:
        return state;
    }
  };
  
  export default roleReducers;
  