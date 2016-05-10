import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import actions from './actions';
import activities from './activities';
import campaigns from './campaigns';
import dashboard from './dashboard';
import locations from './locations';
import org from './org';
import people from './people';
import search from './search';


export const appReducer = combineReducers({
    actions,
    activities,
    campaigns,
    dashboard,
    locations,
    org,
    people,
    search,
});

let middleware = [
    promiseMiddleware(),
    thunk,
];

export const configureStore = compose(
    applyMiddleware(...middleware)
)(createStore);
