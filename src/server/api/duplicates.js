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

    if (master.first_name.trim() == other.first_name.trim()) score += 6;
    if (master.last_name.trim() == other.last_name.trim()) score += 6;
    if (master.ext_id && master.ext_id == other.ext_id) score += 20;

    // Add 6 for identical e-mails, subtract 2 for different
    let mEmail = master.email? master.email.toLowerCase() : null;
    let oEmail = other.email? other.email.toLowerCase() : null;
    if (mEmail && mEmail == oEmail) score += 6;
    else if (mEmail && oEmail && mEmail != oEmail) score -= 2;

    // Add 6 for identical phone numbers, subtract 2 for different
    let mPhone = master.phone? master.phone.replace(/\D/g, '') : null;
    let oPhone = other.phone? other.phone.replace(/\D/g, '') : null;
    if (mPhone && mPhone == oPhone) score += 6;
    else if (mPhone && oPhone && mPhone != oPhone) score -= 2;

    return score;
};

dupApi.get('/:orgId/people', (req, res, next) => {
    req.z.resource('orgs', req.params.orgId, 'people')
        .get()
        .then(result => {
            let people = result.data.data;
            let master;
            let duplicates = [];

            while (master = people.pop()) {
                let duplicate = {
                    id: '$' + makeRandomString(6),
                    objects: [ master ],
                };

                let idx = 0;
                while (idx < people.length) {
                    let other = people[idx];
                    let score = calcSimilarity(master, other);

                    if (score > 10) {
                        duplicate.objects.push(other);
                        people.splice(idx, 1);
                    }
                    else {
                        idx++;
                    }
                }

                if (duplicate.objects.length > 1) {
                    duplicates.push(duplicate);
                }
            }

            res.status(200).json({ duplicates });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

export default dupApi;
