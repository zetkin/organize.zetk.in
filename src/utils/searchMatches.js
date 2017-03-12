
function searchMatches(q, data) {
    let strings = q.split(/\s/);

    if (strings.length == 1) {
        q = q.toLowerCase();

        // This is a rather stupid search, which is likely to incur performance
        // issues. Both the client and server users of this method know the type
        // of object that is being tested, so we could have smarter matching
        // strategies for known objects (i.e. person, location et c).
        // TODO: Deal with variuos object types differently
        for (let key in data) {
            let val = data[key];
            if (typeof val == 'string'
                && val.toLowerCase().indexOf(q) >= 0) {
                return true;
            }
        }

        return false;
    }
    else {
        return strings
            .map(s => searchMatches(s, data))
            .reduce((prev, cur) => prev && cur, true);
    }
}


export default searchMatches;
