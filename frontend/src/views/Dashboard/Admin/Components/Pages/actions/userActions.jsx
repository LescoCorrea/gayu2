import axios from 'axios';

export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/users");
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
  }
};