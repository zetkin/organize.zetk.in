const ALLOWED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function makeRandomString(len = 5) {
    let str = '';

    for (let i = 0; i < len; i++) {
        let idx = Math.floor(Math.random() * ALLOWED_CHARS.length);
        str += ALLOWED_CHARS.charAt(idx);
    }

    return str;
}
