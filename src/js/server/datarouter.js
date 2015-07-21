import express from 'express';
import cookieParser from 'cookie-parser';
import Z from 'zetkin';

import Flux from '../flux';


var router = express.Router();

router.use(cookieParser());
router.all(/.*/, function(req, res, next) {
    if ('apitoken' in req.cookies) {
        // Use token from cookie for authentication with
        // the Zetkin Platform API. Do this before creating
        // the Flux instance, so that the token is available
        // in it's constructor when calling setState().
        Z.setToken(req.cookies.apitoken);
    }

    req.flux = new Flux();

    next();
});

export default router;
