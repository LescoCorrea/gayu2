import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk as reduxThunk } from "redux-thunk";
import AuthReducers from "./reducers/AuthReducers";
import userReducer from "./reducers/userReducers"
import roleReducers from "./reducers/roleReducers";
import metierReducers from "./reducers/metierReducers";
import regionReducers from "./reducers/regionReducers";
import artisanReducers from "./reducers/artisanReducers";
import realisationReducers from "./reducers/realisationReducers";
import favorisReducers from "./reducers/favorisReducers";
import reservationReducer from "./reducers/reservationReducers";
import avisReducer from './reducers/AvisReducers';
import commentaireReducer from './reducers/CommentaireReducers'
import notificationReducer from './reducers/notificationReducer';
import temoignageReducer from './reducers/temoignageReducers';
import contactReducer from './reducers/contactReducers';

// Combinaison des réducteurs pour former le réducteur racine
const rootReducer = combineReducers({
    auth: AuthReducers,
    users: userReducer,
    roles: roleReducers,
    metiers: metierReducers,
    regions: regionReducers,
    artisans: artisanReducers,
    realisations: realisationReducers,
    favoris: favorisReducers,
    reservations: reservationReducer,
    avis: avisReducer,
    commentaires: commentaireReducer,
    notifications: notificationReducer,
    temoignages: temoignageReducer,
    contact: contactReducer,
});

// Activation de l'extension Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    rootReducer,
    {
        
        users: [],
        roles: [],
        metiers: [],
        regions: [],
        artisans: [],
        realisations: [],
        favoris: [],
        reservations: [],
        avis: [],
        commentaires: [],
        notifications: [],
        temoignages: [],
    },
    composeEnhancers(
        applyMiddleware(reduxThunk)
    )
);

export default store;
