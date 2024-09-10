import axios from 'axios';

export const FETCH_COMMENTAIRES_REQUEST = 'FETCH_COMMENTAIRES_REQUEST';
export const FETCH_COMMENTAIRES_SUCCESS = 'FETCH_COMMENTAIRES_SUCCESS';
export const FETCH_COMMENTAIRES_FAILURE = 'FETCH_COMMENTAIRES_FAILURE';
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE';
export const LIKE_COMMENT_SUCCESS = 'LIKE_COMMENT_SUCCESS';
export const LIKE_COMMENT_FAILURE = 'LIKE_COMMENT_FAILURE';
export const UNLIKE_COMMENT_SUCCESS = 'UNLIKE_COMMENT_SUCCESS';
export const UNLIKE_COMMENT_FAILURE = 'UNLIKE_COMMENT_FAILURE';
export const FETCH_LIKES_COUNT_SUCCESS = 'FETCH_LIKES_COUNT_SUCCESS';
export const FETCH_LIKES_COUNT_FAILURE = 'FETCH_LIKES_COUNT_FAILURE';
export const ADD_COMMENT_OPTIMISTIC = 'ADD_COMMENT_OPTIMISTIC';


export const fetchCommentaires = () => async (dispatch) => {
    dispatch({ type: FETCH_COMMENTAIRES_REQUEST });

    try {
        const response = await axios.get('http://127.0.0.1:8000/api/commentaires');
        dispatch({ type: FETCH_COMMENTAIRES_SUCCESS, payload: response.data.commentaires });
    } catch (error) {
        dispatch({ type: FETCH_COMMENTAIRES_FAILURE, error: error.message });
    }
};


/*export const addCommentaire = (realisationId, commentaire, parentCommentId = null) => async (dispatch, getState) => {
    try {
        const state = getState();
        const { user } = state.auth;

        console.log('Roles de l\'utilisateur:', user.roles);
        console.log('Role de l\'utilisateur:', user.role);

        let tempCommentaire;

        if (user.role === 0) {
            // Si l'utilisateur connecté est un utilisateur normal, utiliser user_id et mettre artisan_id à null
            tempCommentaire = {
                id: Date.now(),
                user_id: user.id,
                artisan_id: null,
                user: { name: user.name },
                realisation_id: realisationId,
                commentaire,
                parent_comment_id: parentCommentId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_reply: parentCommentId !== null,
            };
        } else if (user.roles.includes('artisan')) {
            tempCommentaire = {
                id: Date.now(),
                user_id: null,
                artisan_id: user.id,
                artisan: {
                    prenom: user.prenom,
                    nom: user.nom
                },
                realisation_id: realisationId,
                commentaire,
                parent_comment_id: parentCommentId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_reply: parentCommentId !== null,
            };
        } else {
            throw new Error('Rôle utilisateur non pris en charge');
        }

        console.log('Commentaire optimiste:', tempCommentaire);

        dispatch({ type: ADD_COMMENT_OPTIMISTIC, payload: tempCommentaire });

        const response = await axios.post(`http://127.0.0.1:8000/api/realisations/commentaire/${realisationId}`, {
            realisation_id: realisationId,
            commentaire,
            parent_comment_id: parentCommentId,
        });

        dispatch({ type: ADD_COMMENT_SUCCESS, payload: response.data.commentaire });
        dispatch(fetchCommentaires());
    } catch (error) {
        dispatch({ type: ADD_COMMENT_FAILURE, error: error.message });
        // Optionnel : Retirer le commentaire optimiste en cas d'erreur
    }
};*/

export const addCommentaire = (realisationId, commentaire, parentCommentId = null) => async (dispatch, getState) => {
    dispatch({ type: ADD_COMMENT_REQUEST });
    try {
        const state = getState();
        const { user } = state.auth;

        console.log('Rôle de l\'utilisateur:', user.role);

        // Construire l'objet commentaire pour la requête API.
        const commentData = {
            realisation_id: realisationId,
            commentaire,
            parent_comment_id: parentCommentId,
        };

        // Envoyer la requête POST à l'API
        const response = await axios.post(`http://127.0.0.1:8000/api/realisations/commentaire/${realisationId}`, commentData);

        // Dispatchez l'action de succès avec les données du commentaire ajouté
        dispatch({ type: ADD_COMMENT_SUCCESS, payload: response.data.commentaire });
        
        dispatch(fetchCommentaires());
    } catch (error) {
        // Dispatchez l'action d'échec avec le message d'erreur
        dispatch({ type: ADD_COMMENT_FAILURE, error: error.message });
    }
};

export const deleteCommentaire = (commentId) => async (dispatch) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/commentaire/${commentId}`);
        dispatch({ type: 'DELETE_COMMENT_SUCCESS', payload: commentId });
    } catch (error) {
        dispatch({ type: 'DELETE_COMMENT_FAILURE', error: error.message });
    }
};


export const likeCommentaire = (commentId) => async (dispatch) => {
    try {

        const response = await axios.post(`http://127.0.0.1:8000/api/commentaires/${commentId}/like`);
        dispatch({ type: 'LIKE_COMMENT_SUCCESS', payload: { commentId, isLiked: response.data.isLiked } });
        dispatch(fetchLikesCount(commentId));
    } catch (error) {
        console.error('Erreur lors du like du commentaire :', error.message);
        dispatch({ type: 'LIKE_COMMENT_FAILURE', error: error.message });
    }
};


export const unlikeCommentaire = (commentId) => async (dispatch) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/commentaires/${commentId}/unlike`);
        dispatch({ type: 'UNLIKE_COMMENT_SUCCESS', payload: commentId });
        dispatch(fetchLikesCount(commentId));
    } catch (error) {
        dispatch({ type: 'UNLIKE_COMMENT_FAILURE', error: error.message });
    }
};

export const fetchLikesCount = (commentId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/commentaires/${commentId}/like/count`);
        dispatch({ 
            type: FETCH_LIKES_COUNT_SUCCESS,
             payload: {
                commentId,
                likeCount: response.data.likeCount 
            } 
        });
    } catch (error) {
        dispatch({ type: FETCH_LIKES_COUNT_FAILURE, error: error.message });
    }
};