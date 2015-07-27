
function searchMatches(q, data) {
    var key;

    q = q.toLowerCase();

    // This is a rather stupid search, which is likely to incur performance
    // issues. Both the client and server users of this method know the type
    // of object that is being tested, so we could have smarter matching
    // strategies for known objects (i.e. person, location et c).
    // TODO: Deal with variuos object types differently
    for (key in data) {
        var val = data[key];
        if (typeof val == 'string'
            && val.toLowerCase().indexOf(q) >= 0) {
            return true;
        }
    }

    return false;
}


export default searchMatches;
