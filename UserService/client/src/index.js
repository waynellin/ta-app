import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Provider} from "react-redux";
import {browserHistory} from "react-router";
import Routes from "./routes";
import store from "./store";
import { saveState } from './localStorage';

import "./index.css";
import "./bootstrap-style.css";

injectTapEventPlugin();

store.subscribe(() => {
    saveState({
        user: {
            user: store.getState().user.user
        }
    })
});

ReactDOM.render(
    <Provider store={store}>
        <Routes history={browserHistory}/>
    </Provider>,
    document.getElementById('root')
);
