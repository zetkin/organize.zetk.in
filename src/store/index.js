import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import actions from './actions';
import activities from './activities';
import callAssignments from './callAssignments';
import calls from './calls';
import campaigns from './campaigns';
import dashboard from './dashboard';
import documents from './documents';
import invites from './invites';
import locations from './locations';
import locationTags from './locationTags';
import officials from './officials';
import org from './org';
import participants from './participants';
import people from './people';
import importer from './importer';
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
    invites,
    locations,
    officials,
    org,
    participants,
    people,
    importer,
    personTags,
    locationTags,
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
