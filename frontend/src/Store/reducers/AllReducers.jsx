import { combineReducers } from "redux";
import rootReducer from "./rootReducer";


const AllReducers = combineReducers({ 
    auth: rootReducer,
})

export default AllReducers;
