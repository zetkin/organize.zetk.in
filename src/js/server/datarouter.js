import express from 'express';
import Z from 'zetkin';

import Flux from '../flux';


var router = express.Router();

router.all(/.*/, function(req, res, next) {
    req.flux = new Flux();

    req.flux.getActions('user').getUserInfo()
        .then(req.flux.getActions('user').getUserMemberships)
        .then(function(result) {
            var userStore = req.flux.getStore('user');

            if (userStore.isOfficial() == 0 && req.url != '/activist') {
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
    return function(req, res, next) {
        var promises = execActions(req);

        Promise.all(promises).then(() => next());
    }
}

router.get([/people$/, /people\/list$/], waitForActions(req => [
    req.flux.getActions('person').retrievePeople()
]));

router.get(/person:(\d+)$/, waitForActions(req => [
    req.flux.getActions('person').retrievePerson(req.params[0])
]));

router.get([/maps$/, /maps\/locations$/], waitForActions(req => [
    req.flux.getActions('location').retrieveLocations()
]));

router.get(/addlocationwithmap$/, waitForActions(req => [
    req.flux.getActions('location').retrieveLocations()
]));
router.get(/addlocation$/, waitForActions(req => [
    req.flux.getActions('location').retrieveLocations()
]));

router.get(/location:(\d+)$/, waitForActions(req => [
    req.flux.getActions('location').retrieveLocation(req.params[0])
]));

router.get(/campaigns$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaigns()
]));

router.get(/campaign:(\d+)$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaign(req.params[0])
]));

router.get(/campaign\/dashboard$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaigns()
]));

router.get(/campaign\/playback$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaigns(),
    req.flux.getActions('action').retrieveAllActions(),
    req.flux.getActions('location').retrieveLocations()
]));

router.get(/campaign\/actions$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaigns(),
    req.flux.getActions('action').retrieveAllActions()
]));

router.get(/campaign\/activities$/, waitForActions(req => [
    req.flux.getActions('activity').retrieveActivities()
]));

router.get(/editaction:(\d+)$/, waitForActions(req => [
    req.flux.getActions('action').retrieveAction(req.params[0]),
    req.flux.getActions('activity').retrieveActivities(),
    req.flux.getActions('location').retrieveLocations()
]));

export default router;
