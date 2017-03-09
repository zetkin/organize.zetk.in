import express from 'express';

import { createLocalizeHandler } from './locale';
import { configureStore } from '../store';
import { retrieveActions, retrieveAction } from '../actions/action';
import { retrieveActionParticipants } from '../actions/participant';
import { retrieveActionResponses } from '../actions/actionResponse';
import { retrieveActivities } from '../actions/activity';
import { retrieveCampaigns, retrieveCampaign } from '../actions/campaign';
import { retrieveLocations, retrieveLocation } from '../actions/location';
import { retrievePeople, retrievePerson } from '../actions/person';
import { retrievePersonTags } from '../actions/personTag';
import { getUserInfo, getUserMemberships } from '../actions/user';


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
        retrieveActions(),
        retrieveCampaigns(),
    ]));

    router.get(/campaign:(\d+)$/, waitForActions(req => [
        retrieveCampaign(req.params[0])
    ]));

    router.get(/campaign\/dashboard$/, waitForActions(req => [
        retrieveCampaigns()
    ]));

    router.get(/campaign\/playback$/, waitForActions(req => [
        retrieveActions(),
        retrieveCampaigns(),
        retrieveLocations()
    ]));

    router.get(/campaign\/actions$/, waitForActions(req => [
        retrieveActions(),
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
