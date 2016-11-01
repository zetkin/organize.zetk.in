import express from 'express';

const bulkApi = express();

bulkApi.post('/', (req, res, next) => {
    let op = req.body.op;

    if (op in operations) {
        let exec = operations[op];

        exec(req, res)
            .then(result => {
                res.status(200).json({
                    ok: true,
                });
            })
            .catch(err => {
                res.status(500).json({
                    ok: false,
                    error: err,
                });
            });
    }
    else {
        res.status(400).json({
            ok: false,
            error: 'Unknown op ' + op,
        });
    }
});


let operations = {
    'person.tag': (req, res) => {
        let z = req.z;
        let orgId = req.body.orgId;
        let promises = req.body.objects.map(id =>
            Promise.all(req.body.config.tags.map(tag =>
                z.resource('orgs', orgId, 'people', id, 'tags', tag).put())));

        return Promise.all(promises);
    },

    'person.delete': (req, res) => {
        let orgId = req.body.orgId;
        return Promise.all(req.body.objects.map(id =>
            req.z.resource('orgs', orgId, 'people', id).del()));
    },
};

export default bulkApi;
