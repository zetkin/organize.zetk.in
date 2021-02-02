export default (s, maxLength=200) => {
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
                return out + '...';
            }
        }
    }
};
