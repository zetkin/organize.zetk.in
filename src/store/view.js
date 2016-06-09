import * as types from '../actions';

import makeRandomString from '../utils/makeRandomString';


export default function viewState(state = null, action) {
    if (action.type === types.SET_PANES_FROM_URL_PATH) {
        let path = action.payload.path;

        // Remove leading slash
        if (path[0] === '/') {
            path = path.substr(1);
        }

        let segments = path.split('/');

        // Remove first segment if empty
        if (segments[0] === '') {
            segments.splice(0, 1);
        }

        let section, panes;

        if (segments.length == 0) {
            section = 'dashboard';
            panes = [];
        }
        else {
            section = segments[0];
            panes = segments.slice(1).map(segment => {
                let fields = segment.split(':');
                let id = '$' + makeRandomString(6);
                let type = fields[0];
                let params = (fields.length > 1)? fields[1].split(',') : [];

                return { id, type, params };
            });
        }

        return Object.assign({}, state, {
            section, panes,
        });
    }
    else {
        return state || {
            section: 'dashboard',
            panes: [],
        };
    }
}
