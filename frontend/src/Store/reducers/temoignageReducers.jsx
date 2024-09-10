import {
    FETCH_TEMOIGNAGES_SUCCESS,
    FETCH_TEMOIGNAGES_FAILURE,
    ADD_TEMOIGNAGE_SUCCESS,
    ADD_TEMOIGNAGE_FAILURE,
    UPDATE_TEMOIGNAGE_SUCCESS,
    UPDATE_TEMOIGNAGE_FAILURE,
    DELETE_TEMOIGNAGE_SUCCESS,
    DELETE_TEMOIGNAGE_FAILURE
} from '../../views/Dashboard/Admin/Components/Pages/actions/temoignageActions';

const initialState = {
    temoignages: [],
    error: null,
};

const temoignageReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TEMOIGNAGES_SUCCESS:
            return {
                ...state,
                temoignages: action.payload,
                error: null,
            };
        case FETCH_TEMOIGNAGES_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case ADD_TEMOIGNAGE_SUCCESS:
            return {
                ...state,
                temoignages: [...state.temoignages, action.payload],
                error: null,
            };
        case ADD_TEMOIGNAGE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case UPDATE_TEMOIGNAGE_SUCCESS:
            return {
                ...state,
                temoignages: state.temoignages.map(temoignage =>
                    temoignage.id === action.payload.id ? action.payload : temoignage
                ),
                error: null,
            };
        case UPDATE_TEMOIGNAGE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case DELETE_TEMOIGNAGE_SUCCESS:
            return {
                ...state,
                temoignages: state.temoignages.filter(temoignage => temoignage.id !== action.payload),
                error: null,
            };
        case DELETE_TEMOIGNAGE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default temoignageReducer;
