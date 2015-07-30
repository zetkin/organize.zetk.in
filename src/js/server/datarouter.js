import express from 'express';
import Z from 'zetkin';

import Flux from '../flux';


var router = express.Router();

router.all(/.*/, function(req, res, next) {
    req.flux = new Flux();

    req.flux.getActions('user').getUserInfo()
        .then(req.flux.getActions('user').getUserMemberships)
        .then(function(result) {
            next();
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

router.get(/person:(\d+)$/, waitForActions(req => [
    req.flux.getActions('person').retrievePerson(req.params[0])
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
