export default (obj, path) => {
    let o = obj;
    for (let i = 0; i < path.length; i++) {
        let p = path[i];
        if (o && o.hasOwnProperty(p)) {
            o = o[p];
        }
        else {
            return false;
        }
    }

    return true;
};
