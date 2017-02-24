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
            co_address: 'C/o address',
            street_address: 'Street address',
            zip_code: 'Zip code',
            city: 'City',
        };

        return req.z.resource('orgs', orgId, 'people').get()
            .then(result => {
                let people = result.data.data.filter(p =>
                    req.body.objects.indexOf(p.id) >= 0);

                let lastCell = xlsx.utils.encode_cell(
                    { c: Object.keys(FIELDS).length, r: people.length + 1 });

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
