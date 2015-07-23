import express from 'express';
import Z from 'zetkin';

import Flux from '../flux';


var router = express.Router();

router.all(/.*/, function(req, res, next) {
    req.flux = new Flux();

    req.flux.getActions('user').getUserInfo()
        .then(function(result) {
            next();
        })
        .catch(function(err) {
            // TODO: What could this be? Handle!
            next();
        });
});

export default router;
