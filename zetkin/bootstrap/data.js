'use strict';

module.exports.loadDataForRequest = function(req, cb) {
    // TODO: Somehow figure out which data to load, e.g. by mapping a list of
    // Flux actions to the URI path.

    // Return dummy data for now
    cb({
        foo: 'This is "dynamic" data'
    });
};

