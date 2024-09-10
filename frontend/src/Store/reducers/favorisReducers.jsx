
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES,FETCH_ARCHIVES_REQUEST, FETCH_FAVORITES_REQUEST, FETCH_FAVORITES, CHECK_IF_FAVORITE_EXISTS, FETCH_ARCHIVES, ARCHIVE_FAVORIS, UNARCHIVE_FAVORIS } from '../../views/Pages/Artisans/actions/FavorisActions';

const initialState = {
    favoris: [],
    favoriExists: false,
    loading: false,
    archives: {
        loading: false,
        data: [],
    },
};

const favorisReducers = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_FAVORITES_REQUEST:  // Début du chargement
        return {
            ...state,
            loading: true,  // Définir loading à true
        };
        case FETCH_ARCHIVES_REQUEST:
        return {
            ...state,
            archives: {
            ...state.archives,
            loading: true,
            },
        };
        case FETCH_FAVORITES:
            return {
                ...state,
                favoris: action.payload,
                loading: false,
            };
        case FETCH_ARCHIVES:
            return {
                ...state,
                archives: {
                    loading: false,
                    data: action.payload,
                  },
                loading: false,
            };    
            case ADD_TO_FAVORITES:
                return {
                    ...state,
                    favoris: Array.isArray(state.favoris) ? [...state.favoris, action.payload] : [action.payload],
                    loading: false,
                };
            case REMOVE_FROM_FAVORITES:
                    return {
                      ...state,
                      favoris: state.favoris.filter(favori => favori.id !== action.payload), // Assurez-vous que `favoris` est un tableau
                      loading: false,
                    };
        case CHECK_IF_FAVORITE_EXISTS: // Nouveau cas pour gérer la vérification du favori
            return {
                ...state,
                favoriExists: action.payload, // Mettre à jour la propriété favoriExists avec la valeur retournée par l'action
            };
        case ARCHIVE_FAVORIS: {
                const favoriId = action.payload;
                const updatedFavoris = state.favoris.filter(favori => favori.artisan.id !== favoriId);
                const archivedFavori = state.favoris.find(favori => favori.artisan.id === favoriId);
                if (archivedFavori) {
                    return {
                        ...state,
                        favoris: updatedFavoris,
                        archives: [...state.archives, archivedFavori], // Ajoutez l'artisan archivé à la liste des archives
                        loading: false,
                    };
                }

                return state;
            }
            
        case UNARCHIVE_FAVORIS: {
                const favoriId = action.payload;
                const unarchivedFavori = state.archives.find(favori => favori.artisan.id === favoriId);
                if (unarchivedFavori) {
                    const updatedArchives = state.archives.filter(favori => favori.artisan.id !== favoriId);
                    return {
                        ...state,
                        archives: updatedArchives,
                        favoris: [...state.favoris, unarchivedFavori],
                        loading: false,
                    };
                }
                return state;
            }
        default:
            return state;
    }
};

export default favorisReducers;
