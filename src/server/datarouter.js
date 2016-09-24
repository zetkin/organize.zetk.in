import express from 'express';

import { appReducer, configureStore } from '../store';
import { retrieveActions, retrieveAction } from '../actions/action';
import { retrieveActivities } from '../actions/activity';
import { retrieveCampaigns, retrieveCampaign } from '../actions/campaign';
import { retrieveLocations, retrieveLocation } from '../actions/location';
import { retrievePeople, retrievePerson } from '../actions/person';
import { retrievePersonTags } from '../actions/personTag';
import { getUserInfo, getUserMemberships } from '../actions/user';


var router = express.Router();

router.all(/.*/, function(req, res, next) {
    req.store = configureStore(undefined, req.z);

    let a0 = getUserInfo();

    // TODO: Come up with some better way to do this?
    a0({ ...req.store, z: req.z })
        .payload.promise
        .then(function(result) {
            let a1 = getUserMemberships();
            return a1({ ...req.store, z: req.z }).payload.promise;
        })
        .then(function(result) {
            let userStore = req.store.getState().user;

            if (!userStore.memberships.length && req.url != '/activist') {
                // This user does not have any official roles. Redirect to
                // page which explains why they can't use organizer app.
                res.redirect(303, '/activist');
            }
            else {
                next();
            }
        })
        .catch(function(err) {
            // TODO: What could this be? Handle!
            next();
        });
});


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
                        req.store.dispatch(thunkOrAction);
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


router.get(/action:(\d+)$/, waitForActions(req => [
    retrieveAction(req.params[0])
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

router.get(/addlocationwithmap$/, waitForActions(req => [
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

export default router;
