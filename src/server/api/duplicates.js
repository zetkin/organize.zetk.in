import express from 'express';

import makeRandomString from '../../utils/makeRandomString';

const dupApi = express();

// Calc similarity, scoring it above 10 for similar, below 10 for different.
// Examples:
//   * Same name, different phone and e-mail:               8
//   * Same name, different phone or e-mail:                10
//   * Same name, no phone or e-mail:                       12
//   * Same name, phone and e-mail:                         24
//   * Same first name, same e-mail or phone:               12
//   * Same external ID                                     20
const calcSimilarity = (master, other) => {
    let score = 0;

    if (master.n_first_name == other.n_first_name) score += 6;
    if (master.n_last_name == other.n_last_name) score += 6;
    if (master.ext_id && master.ext_id == other.ext_id) score += 20;

    // Add 6 for identical e-mails, subtract 2 for different
    let mEmail = master.n_email;
    let oEmail = other.n_email;
    if (mEmail && mEmail == oEmail) score += 6;
    else if (mEmail && oEmail && mEmail != oEmail) score -= 2;

    // Add 6 for identical phone numbers, subtract 2 for different
    let mPhone = master.n_phone;
    let oPhone = other.n_phone;
    if (mPhone && mPhone == oPhone) score += 6;
    else if (mPhone && oPhone && mPhone != oPhone) score -= 2;

    return score;
};

dupApi.get('/:orgId/people', (req, res, next) => {
    req.z.resource('orgs', req.params.orgId, 'people')
        .get()
        .then(result => {
            let master;
            let duplicates = [];

            let people = result.data.data.map(p => {
                p.consumed = false;
                p.n_phone = p.phone? p.phone.replace(/\D/g, '') : null;
                p.n_email = p.email? p.email.toLowerCase() : null;
                p.n_first_name = p.first_name.trim().toLowerCase();
                p.n_last_name = p.last_name.trim().toLowerCase();

                return p;
            });


            let start = 0;
            while (start < people.length) {
                const master = people[start];
                if (!master.consumed) {
                    let objects;

                    let idx = start + 1;
                    while (idx < people.length) {
                        const other = people[idx];
                        if (!other.consumed) {
                            let score = calcSimilarity(master, other);

                            if (score >= 10) {
                                if (!objects) {
                                    objects = [
                                        master,
                                        other,
                                    ];
                                }
                                else {
                                    objects.push(other);
                                }
                                other.consumed = true;
                            }
                        }

                        idx++;
                    };

                    if (objects) {
                        duplicates.push({
                            id: '$' + makeRandomString(6),
                            objects: objects,
                        });
                    }
                }

                start++;
            }

            res.status(200).json({ duplicates });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

export default dupApi;
