import axios from 'axios';
import { toast } from 'react-toastify';

export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const CHECK_IF_FAVORITE_EXISTS = 'CHECK_IF_FAVORITE_EXISTS';
export const FETCH_ARCHIVES = 'FETCH_ARCHIVES';
export const FETCH_ARCHIVES_REQUEST = 'FETCH_ARCHIVES_REQUEST';
export const ARCHIVE_FAVORIS = 'ARCHIVE_FAVORIS';
export const UNARCHIVE_FAVORIS = 'UNARCHIVE_FAVORIS';
export const FETCH_FAVORITES_REQUEST = 'FETCH_FAVORITES_REQUEST';

export const fetchFavorites = () => async (dispatch) => {
    dispatch({ type: FETCH_FAVORITES_REQUEST })
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/favoris');
        dispatch({ type: FETCH_FAVORITES, payload: response.data });
    } catch (error) {
        console.error('Erreur lors de la récupération des favoris', error);
        toast.error("Une erreur est survenue lors de la récupération des favoris."); 
    }
};

export const addToFavorites = (artisanId) => async (dispatch) => {
    try {
        await axios.post(`http://127.0.0.1:8000/api/favoris/${artisanId}`);
        dispatch({ type: ADD_TO_FAVORITES, payload: artisanId });
        dispatch({ type: CHECK_IF_FAVORITE_EXISTS, payload: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris', error);
        toast.error("Une erreur est survenue lors de l'ajout aux favoris.");
    }
};

export const fetchArchives = () => async (dispatch) => {
    dispatch({ type: FETCH_ARCHIVES_REQUEST })
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/archives');
        dispatch({ type: FETCH_ARCHIVES, payload: response.data });
    } catch (error) {
        console.error('Erreur lors de la récupération des archives', error);
        toast.error("Une erreur est survenue lors de la récupération des archives.");
    }
};

export const archiveFavoris = (artisanId) => {
    return async (dispatch) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/favoris/${artisanId}/archive`);
            dispatch({ type: ARCHIVE_FAVORIS, payload: artisanId });
            toast.success("Favori archivé avec succès!");
            
        } catch (error) {
            console.error("Erreur lors de l'archivage du favori :", error);
            toast.error("Erreur lors de l'archivage du favori. Veuillez réessayer.");
        }
    };
};

export const unarchiveFavoris = (artisanId) => {
    return async (dispatch) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/favoris/${artisanId}/desarchiver`);
            dispatch({ type: UNARCHIVE_FAVORIS, payload: artisanId });
            toast.success("Favori désarchivé avec succès!");
            dispatch(fetchArchives());
        } catch (error) {
            console.error("Erreur lors du désarchivage du favori :", error);
            toast.error("Erreur lors du désarchivage du favori. Veuillez réessayer.");
        }
    };
};

export const removeFromFavorites = (artisanId) => async (dispatch) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/favoris/${artisanId}`);
        dispatch({ type: REMOVE_FROM_FAVORITES, payload: artisanId });
        dispatch({ type: CHECK_IF_FAVORITE_EXISTS, payload: false });
        dispatch(checkIfFavoriteExists());
    } catch (error) {
        console.error('Erreur lors de la suppression des favoris', error);
        toast.error("Une erreur est survenue lors de la suppression des favoris.");
    }
};

export const checkIfFavoriteExists = (artisanId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/favoris/${artisanId}/exists`);
        const favoriExists = response.data.favori_existe;
        dispatch({ type: CHECK_IF_FAVORITE_EXISTS, payload: favoriExists });
    } catch (error) {
        console.error('Erreur lors de la vérification des favoris', error);
    }
};
