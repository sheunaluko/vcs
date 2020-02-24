import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import "./js/index"
import store from "./js/store/index";

import { Provider } from "react-redux";

//BLUEPRINT CSS 
import 'normalize.css/normalize.css';
import "@blueprintjs/core/lib/css/blueprint.css";

//MOSAIC CSS 
import "./react-mosaic-component.css"


//set up react for use with redux 
ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
