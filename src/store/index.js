import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import activities from './activities';
import campaigns from './campaigns';
import locations from './locations';
import org from './org';
import people from './people';


export const appReducer = combineReducers({
    activities, campaigns, locations, org, people
});

let middleware = [
    promiseMiddleware(),
    thunk,
];

export const configureStore = compose(
    applyMiddleware(...middleware)
)(createStore);
