// src/js/store/index.js
import { createStore } from "redux";
import {initialState, rootReducer} from "../reducers/index";
const store = createStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() );
export default store;
