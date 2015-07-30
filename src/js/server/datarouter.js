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

router.get(/location:(\d+)$/, waitForActions(req => [
    req.flux.getActions('location').retrieveLocation(req.params[0])
]));

router.get(/campaigns$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaigns()
]));

router.get(/campaign:(\d+)$/, waitForActions(req => [
    req.flux.getActions('campaign').retrieveCampaign(req.params[0])
]));

router.get(/campaign\/actions$/, waitForActions(req => [
    req.flux.getActions('action').retrieveAllActions()
]));

export default router;
