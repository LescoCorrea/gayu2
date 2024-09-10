const initialState = {
    metiers: [],
    fetchCountMetier: 0
  };
  
  const metierReducers = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_METIER':
        return {
          ...state,
          metiers: [...state.metiers, action.payload]
        };
      case 'UPDATE_METIER':
        return {
          ...state,
          metiers: state.metiers.map(metier =>
            metier.id === action.payload.id ? action.payload : metier
          )
        };
        
      case 'DELETE_METIER':
        return {
          ...state,
          metiers: state.metiers.filter(metier => metier.id !== action.payload)
        };
      case 'FETCH_METIERS':
        return {
          ...state,
          metiers: action.payload,
          fetchCountMetier: state.fetchCountMetier + 1
        };
      default:
        return state;
    }
  };
  
  export default metierReducers;
  