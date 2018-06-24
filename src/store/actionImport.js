import * as types from '../actions';


export default function actionImport(state = null, action) {
    if (action.type == types.PARSE_ACTION_IMPORT_FILE + '_FULFILLED') {
        return Object.assign({}, state, {
            tableSet: action.payload.tableSet,
        });
    }
    else {
        return state || {
            tableSet: null,
        };
    }
}
