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

export default router;
