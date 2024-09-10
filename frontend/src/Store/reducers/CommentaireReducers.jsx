import {
    FETCH_COMMENTAIRES_REQUEST,
    FETCH_COMMENTAIRES_SUCCESS,
    FETCH_COMMENTAIRES_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE
} from '../../views/Pages/Artisans/actions/CommentaireActions';
const initialState = {
    commentaires: [],
    loading: false,
    error: null,
    likesCount: {},
};

const commentaireReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COMMENTAIRES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_COMMENTAIRES_SUCCESS:
            return {
                ...state,
                loading: false,
                commentaires: action.payload
            };
        case FETCH_COMMENTAIRES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            };
            case ADD_COMMENT_REQUEST:
            return {
                ...state,
                loading: true
            };
            case ADD_COMMENT_SUCCESS:
                return {
                    ...state,
                    commentaires: state.commentaires.map(commentaire =>
                        commentaire.id === action.payload.id ? action.payload : commentaire
                    ),
                }; 
        case ADD_COMMENT_FAILURE:
            return { ...state, error: action.error };
        case 'DELETE_COMMENT_SUCCESS':
            return {
                ...state,
                commentaires: {
                    ...state.commentaires,
                    [action.realisationId]: state.commentaires[action.realisationId].filter(commentaire => commentaire.id !== action.payload)
                }
            };
        case 'DELETE_COMMENT_FAILURE':
            return { ...state, error: action.error };
        case 'LIKE_COMMENT_SUCCESS':
            return {
                ...state,
                commentaires: state.commentaires.map(comment =>
                    comment.id === action.payload
                        ? { ...comment, liked: true, likeCount: (comment.likeCount || 0) + 1 }
                        : comment
                ),
            };
        case 'LIKE_COMMENT_FAILURE':
            return { ...state, error: action.error }; 
        case 'UNLIKE_COMMENT_SUCCESS':
            return {
                ...state,
                commentaires: state.commentaires.map(comment =>
                    comment.id === action.payload
                        ? { ...comment, liked: false, likeCount: (comment.likeCount || 0) - 1 }
                        : comment
                ),
            };   
        case 'UNLIKE_COMMENT_FAILURE':
            return { ...state, error: action.error }; 
        case 'FETCH_LIKES_COUNT_SUCCESS':
                return {
                    ...state,
                    likesCount: {
                        ...state.likesCount,
                        [action.payload.commentId]: action.payload.likeCount,
                    },
                };
        case 'FETCH_LIKES_COUNT_FAILURE':
                return {
                    ...state,
                    error: action.error,
                }; 
        default:
            return state;
    }
};

export default commentaireReducer;
