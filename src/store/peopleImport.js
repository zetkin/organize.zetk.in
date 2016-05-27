import * as types from '../actions';


export default function peopleImport(state = null, action) {
    switch (action.type) {
        case types.PARSE_IMPORT_FILE + '_FULFILLED':
            return Object.assign({}, state, {
                tableSet: action.payload.tableSet,
            });

        default:
            return state || {
                tableSet: null,
            };
    }

    return state;
}
