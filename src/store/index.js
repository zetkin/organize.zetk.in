import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import campaigns from './campaigns';
import locations from './locations';
import org from './org';
import people from './people';


export const appReducer = combineReducers({
    campaigns, locations, org, people
});

let middleware = [
    promiseMiddleware(),
    thunk,
];

export const configureStore = compose(
    applyMiddleware(...middleware)
)(createStore);
