const initialState = {
    regions: [],
    fetchCountRegion: 0
  };
  
  const regionReducers = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_REGION':
        return {
          ...state,
          regions: [...state.regions, action.payload]
        };
      case 'UPDATE_REGION':
        return {
          ...state,
          regions: state.regions.map(region =>
            region.id === action.payload.id ? action.payload : region
          )
        };
      case 'DELETE_REGION':
        return {
          ...state,
          regions: state.regions.filter(region => region.id !== action.payload)
        };
      case 'FETCH_REGIONS':
        return {
          ...state,
          regions: action.payload,
          fetchCountRegion: state.fetchCountRegion + 1
        };
      default:
        return state;
    }
  };
  
  export default regionReducers;
  