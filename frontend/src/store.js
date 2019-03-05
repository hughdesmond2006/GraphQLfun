import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import math from "./reducers/mathReducer";
import user from "./reducers/userReducer";


export default createStore(
    combineReducers({
        math: math,
        user: user
    }),
    applyMiddleware(logger, thunk, promise())
);
