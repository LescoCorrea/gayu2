import axios from 'axios';

// Type d'action
export const UPDATE_RESERVATION_STATUS = 'UPDATE_RESERVATION_STATUS';

// Fonction pour mettre à jour le statut de la réservation
export const updateReservationStatus = (reservationId, newStatus) => async (dispatch) => {
    const response = await axios.put(
        `http://localhost:8000/api/reservations/${reservationId}/status`, { status: newStatus }
    );
    dispatch({
        type: UPDATE_RESERVATION_STATUS,
        payload: response.data,
    });
};
