import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import debounce from 'lodash.debounce';

import loginRedirect from '../common/redux/middleware/loginRedirect';

import actionImport from './actionImport';
import actions from './actions';
import actionResponses from './actionResponses';
import activities from './activities';
import addresses from './addresses';
import alerts from './alerts';
import bulk from './bulk';
import callAssignments from './callAssignments';
import calls from './calls';
import canvassAssignments from './canvassAssignments';
import campaigns from './campaigns';
import dashboard from './dashboard';
import documents from './documents';
import groups from './groups';
import intl from './intl';
import invites from './invites';
import locations from './locations';
import locationTags from './locationTags';
import officials from './officials';
import org from './org';
import participants from './participants';
import people from './people';
import importer from './importer';
import payments from './payments';
import personTags from './personTags';
import prints from './prints';
import queries from './queries';
import routes from './routes';
import search from './search';
import selections from './selections';
import smsDistributions from './smsDistributions';
import surveys from './surveys';
import surveySubmissions from './surveySubmissions';
import timelines from './timelines';
import user from './user';
import view from './view';
import visits from './visits';

import { urlMiddleware } from './middleware/url';


const appReducer = combineReducers({
    actionImport,
    actions,
    actionResponses,
    activities,
    addresses,
    alerts,
    bulk,
    callAssignments,
    calls,
    canvassAssignments,
    campaigns,
    dashboard,
    documents,
    groups,
    invites,
    intl,
    locations,
    officials,
    org,
    participants,
    people,
    importer,
    payments,
    personTags,
    locationTags,
    prints,
    queries,
    routes,
    search,
    selections,
    smsDistributions,
    surveys,
    surveySubmissions,
    timelines,
    user,
    view,
    visits,
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
        loginRedirect(),
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
