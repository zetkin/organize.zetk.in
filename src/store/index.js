import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import actions from './actions';
import activities from './activities';
import campaigns from './campaigns';
import dashboard from './dashboard';
import locations from './locations';
import org from './org';
import participants from './participants';
import people from './people';
import search from './search';
import user from './user';


export const appReducer = combineReducers({
    actions,
    activities,
    campaigns,
    dashboard,
    locations,
    org,
    participants,
    people,
    search,
    user,
});

let middleware = [
    promiseMiddleware(),
    thunk,
];

export const configureStore = compose(
    applyMiddleware(...middleware)
)(createStore);
