import express from 'express';
import xlsx from 'xlsx';


const bulkApi = express();

bulkApi.post('/', (req, res, next) => {
    let op = req.body.op;

    if (op in operations) {
        let exec = operations[op];

        exec(req, res)
            .then(result => {
                if (!res.headersSent) {
                    // If headers have not already been sent, send a simple
                    // status object indicating that the bulk op was executed.
                    res.status(200).json({
                        ok: true,
                    });
                }
            })
            .catch(err => {
                console.log('Error executing bulk op ' + op);
                console.trace(err);
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
    'action.export': (req, res) => {
        const orgId = req.body.orgId;

        const HEADER = [
            'ID',
            'Date',
            'Start time',
            'End time',
            'Location',
            'Activity',
            'Contact name',
            'Contact e-mail',
            'Contact phone',
        ];

        let contacts = {};
        let actions;
        let maxActionsSupportedInExport = 100;

        return req.z.resource('orgs', orgId, 'actions').get()
            .then(result => {
                let cappedSelectedActions = req.body.objects.slice(0, maxActionsSupportedInExport);

                actions = result.data.data.filter(a =>
                    cappedSelectedActions.indexOf(a.id) >= 0);

                // Make a list of contact IDs
                actions.forEach(action => {
                    if (action.contact) {
                        contacts[action.contact.id.toString()] = null;
                    }
                });

                // Load all contacts
                let promise = Promise.resolve();
                Object.keys(contacts).forEach(id => {
                    promise = promise.then(() => {
                        return req.z.resource('orgs', orgId, 'people', id)
                            .get()
                            .then(result => {
                                const person = result.data.data;
                                contacts[person.id.toString()] = person;
                            });
                    });
                });

                return promise;
            })
            .then(() => {
                let lastCell = xlsx.utils.encode_cell(
                    { c: HEADER.length, r: actions.length });

                let wb = {
                    SheetNames: ['Zetkin'],
                    Sheets: {
                        Zetkin: {
                            '!ref': xlsx.utils.encode_range('A1', lastCell),
                        },
                    },
                };

                // First write header
                HEADER.forEach((h, col) => {
                    let addr = xlsx.utils.encode_cell({ c: col, r: 0 });
                    wb.Sheets.Zetkin[addr] = { v: h };
                });

                actions.forEach((action, row) => {
                    const startTime = new Date(action.start_time);
                    const endTime = new Date(action.end_time);

                    const values = [
                        action.id,
                        startTime.format('{yyyy}-{MM}-{dd}'),
                        startTime.format('{HH}:{mm}'),
                        endTime.format('{HH}:{mm}'),
                        action.location.title,
                        action.activity.title,
                    ];

                    if (action.contact) {
                        const contact = contacts[action.contact.id.toString()];
                        values.push(
                            contact.first_name + ' ' + contact.last_name,
                            contact.email,
                            contact.phone,
                        );
                    }

                    values.forEach((value, col) => {
                        let addr = xlsx.utils.encode_cell({ c: col, r: row + 1 });
                        wb.Sheets.Zetkin[addr] = { v: value };
                    });
                });

                let buf = xlsx.write(wb, {
                    bookType: 'xlsx',
                    bookSST: false,
                    type: 'buffer',
                });

                res.attachment('action-export.xlsx')
                    .send(buf);
            });
    },

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
        return req.z.resource('users', 'me', 'memberships')
            .get()
            .then(result => {
                const userPersonId = result.data.data
                    .find(m => m.organization.id == orgId)
                    .profile.id;

                const promises = req.body.objects
                    .filter(id => id != userPersonId)
                    .map(id =>
                        req.z.resource('orgs', orgId, 'people', id).del());

                return Promise.all(promises);
            });
    },

    'person.export': (req, res) => {
        let orgId = req.body.orgId;

        const FIELDS = {
            id: 'ID',
            ext_id: 'External ID',
            first_name: 'First name',
            last_name: 'Last name',
            gender: 'Gender',
            email: 'E-mail',
            phone: 'Phone',
            alt_phone: 'Alt Phone',
            co_address: 'C/o address',
            street_address: 'Street address',
            zip_code: 'Zip code',
            city: 'City',
            country: 'Country',
        };

        return req.z.resource('orgs', orgId, 'people').get()
            .then(result => {
                let people = result.data.data.filter(p =>
                    req.body.objects.indexOf(p.id) >= 0);

                let lastCell = xlsx.utils.encode_cell(
                    { c: Object.keys(FIELDS).length, r: people.length });

                let wb = {
                    SheetNames: ['Zetkin'],
                    Sheets: {
                        Zetkin: {
                            '!ref': xlsx.utils.encode_range('A1', lastCell),
                        },
                    },
                };

                // First write header
                Object.keys(FIELDS).forEach((field, col) => {
                    let addr = xlsx.utils.encode_cell({ c: col, r: 0 });
                    wb.Sheets.Zetkin[addr] = { v: FIELDS[field] };
                });

                people.forEach((person, row) => {
                    Object.keys(FIELDS).forEach((field, col) => {
                        let addr = xlsx.utils.encode_cell({ c: col, r: row + 1 });
                        wb.Sheets.Zetkin[addr] = { v: person[field] || '' };
                    });
                });

                let buf = xlsx.write(wb, {
                    bookType: 'xlsx',
                    bookSST: false,
                    type: 'buffer',
                });

                res.attachment('zetkin-export.xlsx')
                    .send(buf);
            });
    },
};

export default bulkApi;
