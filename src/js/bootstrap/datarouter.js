'use strict';

var express = require('express');
var router = express.Router()

router.get('/', function(req, res, next) {
    // TODO: Do some asynchronous Flux data retrieval
    res.bootstrapData = {
        foo: 'home endpoint'
    };

    next();
});

router.get('/test', function(req, res, next) {
    // TODO: Do some asynchronous Flux data retrieval
    res.bootstrapData = {
        foo: 'test endpoint'
    };

    next();
});

module.exports = router;
