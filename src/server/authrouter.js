import querystring from 'querystring';
import express from 'express';
import Z from 'zetkin';
import url from 'url';

var router = express();

var redirectToLogin = function(req, res) {
    // TODO: Don't hard-code this URL
    var reqUrlObj = url.parse(req.url, true);

    reqUrlObj.protocol = req.protocol;
    reqUrlObj.host = req.get('Host');
    if ('token' in reqUrlObj.query) {
        delete reqUrlObj.query.token;
    }

    var redir = encodeURI(url.format(reqUrlObj));
    var host = 'accounts.' + process.env.ZETKIN_DOMAIN;
    var loginUrl = '//' + host + '/login?redir=' + redir;

    res.redirect(303, loginUrl);
}

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

        // Verify that the token is valid
        Z.resource('/session').get()
            .then(function(result) {
                next();
            })
            .catch(function(err) {
                if (err.httpStatus == 401) {
                    // There was a token, but it's invalid (e.g. expired).
                    // The visitor will need to authenticate again to get
                    // a new token.
                    res.clearCookie('apitoken');
                    redirectToLogin(req, res);
                }
                else {
                    next();
                }
            });
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
            redirectToLogin(req, res);
        }
    }
});

export default router;
