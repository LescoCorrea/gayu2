import axios from 'axios';

export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
export const FETCH_NOTIFICATIONS_FAILURE = 'FETCH_NOTIFICATIONS_FAILURE';
export const MARK_NOTIFICATION_READ_SUCCESS = 'MARK_NOTIFICATION_READ_SUCCESS';
export const MARK_NOTIFICATION_READ_FAILURE = 'MARK_NOTIFICATION_READ_FAILURE';

export const fetchNotifications = () => async (dispatch) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/notifications');
        dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data.notifications });
    } catch (error) {
        dispatch({ type: FETCH_NOTIFICATIONS_FAILURE, error: error.message });
    }
};

export const fetchNotificationsArtisan = () => async (dispatch) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/artisan/notifications');
        dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data.notifications });
    } catch (error) {
        dispatch({ type: FETCH_NOTIFICATIONS_FAILURE, error: error.message });
    }
};