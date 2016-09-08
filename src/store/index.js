import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import actions from './actions';
import activities from './activities';
import callAssignments from './callAssignments';
import calls from './calls';
import campaigns from './campaigns';
import dashboard from './dashboard';
import documents from './documents';
import locations from './locations';
import org from './org';
import participants from './participants';
import people from './people';
import personTags from './personTags';
import queries from './queries';
import search from './search';
import selections from './selections';
import user from './user';
import view from './view';

import { urlMiddleware } from './middleware/url';


const appReducer = combineReducers({
    actions,
    activities,
    callAssignments,
    calls,
    campaigns,
    dashboard,
    documents,
    locations,
    org,
    participants,
    people,
    personTags,
    queries,
    search,
    selections,
    user,
    view,
});

export const configureStore = (initialState, z) => {
    let thunkWithZ = store => next => action => {
        if (typeof action === 'function') {
            return action({ ...store, z });
        }

        return next(action);
    };

    let middleware = [
        urlMiddleware,
        promiseMiddleware(),
        thunkWithZ,
    ];

    let devTools = f => f;
    if (typeof window === 'object' && window.devToolsExtension) {
        devTools = window.devToolsExtension();
    }
    let createWithMiddleware = compose(
        applyMiddleware(...middleware),
        devTools,
    )(createStore);

    return createWithMiddleware(appReducer, initialState);
};
