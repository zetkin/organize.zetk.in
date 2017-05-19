import Fuse from 'fuse.js';

const fuseOptions = {
    location: 0,
    distance: 10,
    includeScore: true,
    includeMatches: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    threshold: 0.2,
    keys: [
        // TODO: Use different keys for different types
        'title',
        'info_text',
        'description',
        'first_name',
        'last_name',
        'email',
        'phone',
    ],
};


function searchMatches(q, data) {
    let fuse = new Fuse([ data ], fuseOptions);
    let tokens = q.split(/\s/);

    let tokenLenSum = tokens.reduce((sum, t) => sum + t.length, 0);
    let avgTokenLen = tokenLenSum / tokens.length;

    if (avgTokenLen < 2.5) {
        return false;
    }

    let queryMatches = tokens
        .map(s => {
            let stringMatches = fuse.search(s);
            return stringMatches.length? stringMatches[0] : null;
        })
        .filter(m => !!m);

    // Must match all tokens
    if (queryMatches.length == tokens.length) {
        let matches = queryMatches.reduce((prev, cur) =>
            prev.concat(cur.matches), []);

        return matches;
    }
    else {
        return false;
    }
}


export default searchMatches;
