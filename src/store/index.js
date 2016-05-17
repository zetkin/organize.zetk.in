import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import actions from './actions';
import activities from './activities';
import callAssignments from './callAssignments';
import campaigns from './campaigns';
import dashboard from './dashboard';
import documents from './documents';
import locations from './locations';
import org from './org';
import participants from './participants';
import people from './people';
import queries from './queries';
import search from './search';
import selections from './selections';
import user from './user';


export const appReducer = combineReducers({
    actions,
    activities,
    callAssignments,
    campaigns,
    dashboard,
    documents,
    locations,
    org,
    participants,
    people,
    queries,
    search,
    selections,
    user,
});

let middleware = [
    promiseMiddleware(),
    thunk,
];

export const configureStore = compose(
    applyMiddleware(...middleware)
)(createStore);
