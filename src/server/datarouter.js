import express from 'express';

import { createLocalizeHandler } from './locale';
import { configureStore } from '../store';
import { retrieveActions, retrieveAction, retrieveActionsOnDay } from '../actions/action';
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
    ]));

    router.get([/people$/, /people\/list$/], waitForActions(req => [
    ]));

    router.get(/people\/import$/, waitForActions(req => [
    ]));

    router.get(/person:(\d+)$/, waitForActions(req => [
    ]));

    router.get([/maps$/, /maps\/locations$/], waitForActions(req => [
    ]));

    router.get(/addlocation$/, waitForActions(req => [
    ]));

    router.get(/location:(\d+)$/, waitForActions(req => [
    ]));

    router.get(/campaigns$/, waitForActions(req => [
    ]));

    router.get(/campaign\/locations$/, waitForActions(req => [
    ]));

    router.get(/campaign:(\d+)$/, waitForActions(req => [
    ]));

    router.get(/campaign\/dashboard$/, waitForActions(req => [
    ]));

    router.get(/campaign\/playback$/, waitForActions(req => [
    ]));

    router.get(/campaign\/distribution$/, waitForActions(req => [
    ]));

    router.get(/campaign\/actions$/, waitForActions(req => [
    ]));

    router.get(/dialog\/startassignment$/, waitForActions(req => [
    ]));

    router.get(/editaction:(\d+)$/, waitForActions(req => [
    ]));

    router.get(/actionday:([-0-9]*)/, waitForActions(req => [
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
