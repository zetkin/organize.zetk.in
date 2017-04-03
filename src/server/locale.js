import { flatten } from 'flat';
import Negotiator from 'negotiator';
import subset from 'object-subset';
import recurse from 'recursive-readdir';
import yaml from 'node-yaml';

import { setIntlData } from '../actions/intl';


export function getMessageSubset(messages, scope, locale) {
    if (typeof scope === 'string' || scope instanceof String) {
        scope = [ scope ];
    }

    let localized = messages[locale];
    let scoped = subset(scope, localized);
    let flat = flatten(scoped);

    return flat;
}

export function createLocalizeHandler(messages) {
    return scope => (req, res, next) => {
        let state = req.store.getState();
        let negotiator = new Negotiator(req);

        let browserLocale = negotiator.language(['en', 'sv', 'da']) || 'en';
        let locale = state.user.user.lang || browserLocale;

        req.store.dispatch(setIntlData({
            locale,
            messages: getMessageSubset(messages, scope, locale),
        }));

        next();
    };
}

export function loadLocaleHandler() {
    return (req, res, next) => {
        let scope = req.query.scope.split(',');
        let locale = req.query.lc;

        let messages = getMessageSubset(req.app.messages, scope, locale);

        res.status(200).json({
            locale, scope, messages,
        });
    };
}

export function loadMessages(path, cb) {
    let messages = {};

    let ignore = (file, stats) =>
        !stats.isDirectory() && !file.endsWith('.yaml');

    recurse(path, [ ignore ], (err, files) => {
        if (err) {
            return console.log('readdir() error', err);
        }

        let numCompleted = 0;
        for (let i = 0; i < files.length; i++) {
            yaml.read(files[i], null, (err, data) => {
                if (err) {
                    cb(err, null);
                }
                else {
                    let relPath = files[i].replace(path, '')

                    let pathElems = relPath
                        .substring(1, relPath.length - 5)
                        .split('/');

                    // Locale dot path is language first, then the path of the
                    // file (which denotes the "scope").
                    let dotPath = [
                        pathElems[pathElems.length - 1],
                        ...pathElems.slice(0, pathElems.length -1)
                    ];

                    let par = messages;
                    for (let i = 0; i < dotPath.length; i++) {
                        let e = dotPath[i];
                        if (!par.hasOwnProperty(e)) {
                            par[e] = {};
                        }

                        par = par[e];
                    }

                    Object.assign(par, data);
                }

                numCompleted++;
                if (numCompleted === files.length) {
                    cb(null, messages);
                }
            });
        }
    });
}
