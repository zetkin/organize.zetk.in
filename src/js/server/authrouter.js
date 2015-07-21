import querystring from 'querystring';
import express from 'express';
import Z from 'zetkin';
import url from 'url';

var router = express();

/**
 * This is the main user authentication flow, concisting of:
 *
 * 0. Visitor arrives, do nothing if they have a token cookie, else:
 * 1. Anonymous visitor is redirected to accounts.zetk.in
 * 2. Once authenticated, is redirected here with token query param
 * 3. Token is stored in cookie and user redirected to path without QS
*/
router.all(/.*/, function(req, res, next) {

    // 0. Visitor arrives. Do they have a token cookie?
    if ('apitoken' in req.cookies) {
        // Use token from cookie for authentication with
        // the Zetkin Platform API.
        Z.setToken(req.cookies.apitoken);
        next();
    }
    else {
        var urlObj = url.parse(req.url, true);

        if ('token' in urlObj.query) {
            // 2. Post-authentication redirect
            // This is a redirect from accounts.zetk.in with
            // a token in the URL, so use that token from now
            // on and allow this to proceed.
            res.cookie('apitoken', urlObj.query.token);

            delete urlObj.search;
            delete urlObj.query.token;
            urlObj.query = querystring.stringify(urlObj.query);

            // 3. Redirect to path without the token in the QS
            res.redirect(303, url.format(urlObj));
        }
        else {
            // 1. Anonymous visitor must login
            // The visitor is not authenticated, so they will be
            // redirected to accounts.zetk.in for logging in.
            // TODO: Don't hard-code this URL
            var reqUrl = req.protocol + '://' + req.get('Host') + req.url;
            var redir = encodeURI(reqUrl);
            var loginUrl = 'http://accounts.zetk.in:8000/login?redir=' + redir;

            res.redirect(303, loginUrl);
        }
    }
});

export default router;
