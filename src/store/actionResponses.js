import * as types from '../actions';


export default function actionResponses(state = null, action) {
    if (action.type == types.RETRIEVE_ACTION_RESPONSES + '_FULFILLED') {
        let byAction = Object.assign({}, state.byAction);
        let actionId = action.meta.actionId;

        byAction[actionId] = action.payload.data.data;
        return Object.assign({}, state, { byAction: byAction });
    }
    else {
        return state || {
            byAction: {},
        };
    }
}
