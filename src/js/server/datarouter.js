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

router.get(/person:(\d+)$/, function(req, res, next) {
    req.flux.getActions('person').retrievePerson(req.params[0])
        .then(function() {
            next();
        })
        .catch(function(err) {
            // TODO: What could this be? Handle!
            next();
        });
});

router.get(/location:(\d+)$/, function(req, res, next) {
    req.flux.getActions('location').retrieveLocation(req.params[0])
        .then(function() {
            next();
        });
});

router.get(/campaigns$/, function(req, res, next) {
    req.flux.getActions('campaign').retrieveCampaigns()
        .then(function() {
            next();
        });
});

router.get(/campaign:(\d+)$/, function(req, res, next) {
    req.flux.getActions('campaign').retrieveCampaign(req.params[0])
        .then(function() {
            next();
        });
});

router.get(/campaign\/actions$/, function(req, res, next) {
    req.flux.getActions('action').retrieveAllActions()
        .then(function() {
            next();
        });
});

export default router;
