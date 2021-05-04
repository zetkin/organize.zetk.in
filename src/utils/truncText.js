export default (s, maxLength=200) => {
    if (s == null) {
        return '';
    }
    if (s.length < maxLength) {
        return s;
    }
    else {
        const words = s.split(' ');
        let out = '';

        for (let word of words) {
            if (out.length + word.length + 3 < maxLength) {
                out += ' ' + word;
            }
            else {
                if(out.length > 0) {
                    return out + '...';
                } else {
                    return s.substr(0, maxLength) + '...';
                }

            }
        }
    }
};
