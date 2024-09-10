// notificationReducer.js
import { FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_FAILURE } from '../../views/Dashboard/Artisan/Components/Layouts/actions/NotificationActions';

const initialState = {
    items: [],
    error: null,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          items: action.payload,
        };
      case FETCH_NOTIFICATIONS_FAILURE:
        return {
          ...state,
          error: action.error,
        };
      default:
        return state;
    }
};

export default notificationReducer;
