import express from 'express';
import Z from 'zetkin';

import Flux from '../flux';


var router = express.Router();

router.all(/.*/, function(req, res, next) {
    req.flux = new Flux();

    next();
});

export default router;
