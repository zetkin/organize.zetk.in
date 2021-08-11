import express from 'express';

import { createLocalizeHandler } from './locale';
import { configureStore } from '../store';
import { retrieveAction, retrieveActionsOnDay } from '../actions/action';
import { retrieveActionParticipants } from '../actions/participant';
import { retrieveActionResponses } from '../actions/actionResponse';
import { retrieveActivities } from '../actions/activity';
import { retrieveCampaigns, retrieveCampaign } from '../actions/campaign';
import { retrieveLocations, retrieveLocation } from '../actions/location';
import { retrievePeople, retrievePerson } from '../actions/person';
import { retrievePersonTags } from '../actions/personTag';
import { getUserInfo, getUserMemberships } from '../actions/user';
import { setActiveOrg } from '../actions/user';


export default messages => {
    var router = express.Router();

    const localizeHandler = createLocalizeHandler(messages);

    router.all(/.*/, function(req, res, next) {
        let initialState = {};

        req.store = configureStore(initialState, req.z);

        next();
    });

    router.use('*', waitForActions(req => [
        getUserInfo(),
        getUserMemberships(),
    ]));

    // Route for switching organizations
    router.get('*', (req, res, next) => {
        let state = req.store.getState();
        let orgId = null;

        let orgIsValid = orgId =>
            !!state.user.memberships.find(m => m.organization.id == orgId);

        if (req.query.org && orgIsValid(req.query.org)) {
            // Will store organization from querystring in cookie and redirect.
            // The next request will fall into the next condition.
            res.cookie('activeOrgId', req.query.org);
            res.redirect('/');
            return;
        }
        else if (req.cookies.activeOrgId) {
            // Will use organization from cookie, if (still) valid
            if (orgIsValid(req.cookies.activeOrgId)) {
                req.store.dispatch(setActiveOrg(req.cookies.activeOrgId));
            }
            else {
                res.clearCookie('activeOrgId');
            }

            next();
        }
        else {
            // Will use default, which is first organization
            next();
        }
    });

    // TODO: Change scope depending on URL
    router.use(localizeHandler());

    router.get(/action:(\d+)$/, waitForActions(req => [
        retrieveAction(req.params[0]),
        retrieveActionResponses(req.params[0]),
        retrieveActionParticipants(req.params[0]),
    ]));

    router.get([/people$/, /people\/list$/], waitForActions(req => [
        retrievePeople()
    ]));

    router.get(/people\/import$/, waitForActions(req => [
        retrievePersonTags(),
    ]));

    router.get(/person:(\d+)$/, waitForActions(req => [
        retrievePerson(req.params[0])
    ]));

    router.get([/maps$/, /maps\/locations$/], waitForActions(req => [
        retrieveLocations()
    ]));

    router.get(/addlocation$/, waitForActions(req => [
        retrieveLocations()
    ]));

    router.get(/location:(\d+)$/, waitForActions(req => [
        retrieveLocation(req.params[0])
    ]));

    router.get(/campaigns$/, waitForActions(req => [
        retrieveCampaigns(),
    ]));

    router.get(/campaign\/locations$/, waitForActions(req => [
        retrieveCampaigns(),
    ]));

    router.get(/campaign:(\d+)$/, waitForActions(req => [
        retrieveCampaign(req.params[0])
    ]));

    router.get(/campaign\/dashboard$/, waitForActions(req => [
        retrieveCampaigns()
    ]));

    router.get(/campaign\/playback$/, waitForActions(req => [
        retrieveActivities(),
        retrieveCampaigns(),
        retrieveLocations()
    ]));

    router.get(/campaign\/distribution$/, waitForActions(req => [
        retrieveActivities(),
        retrieveCampaigns()
    ]));

    router.get(/campaign\/actions$/, waitForActions(req => [
        retrieveActivities(),
        retrieveCampaigns(),
    ]));

    router.get(/dialog\/startassignment$/, waitForActions(req => [
        retrieveCampaigns(),
    ]));

    router.get(/editaction:(\d+)$/, waitForActions(req => [
        retrieveAction(req.params[0]),
        retrieveActivities(),
        retrieveLocations()
    ]));

    router.get(/actionday:([-0-9]*)/, waitForActions(req => [
        retrieveActionsOnDay(req.params[0]),
    ]));

    return router;
}


function waitForActions(execActions) {
    return (req, res, next) => {
        let thunksOrActions = execActions(req);
        let promises = [];

        for (let i = 0; i < thunksOrActions.length; i++) {
            let thunkOrAction = thunksOrActions[i];
            if (typeof thunkOrAction === 'function') {
                // Invoke thunk method, passing an augmented store where the
                // dispatch method has been replaced with a method that also
                // saves the dispatched action to be inspected for promises.
                thunkOrAction({
                    ...req.store,
                    z: req.z,
                    dispatch: function(action) {
                        thunkOrAction = action;
                    }
                });
            }

            if (thunkOrAction.payload && thunkOrAction.payload.promise) {
                promises.push(thunkOrAction.payload.promise);
            }

            req.store.dispatch(thunkOrAction);
        }

        Promise.all(promises)
            .then(() => next())
            .catch(() => next());
    };
}
