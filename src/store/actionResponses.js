import * as types from '../actions';


export default function actionResponses(state = null, action) {
    if (action.type == types.RETRIEVE_ACTION_RESPONSES + '_PENDING') {
        return Object.assign({}, state, {
            byAction: Object.assign({}, state.byAction, {
                [action.meta.actionId]: [],
            }),
        });
    }
    else if (action.type == types.RETRIEVE_ACTION_RESPONSES + '_FULFILLED') {
        return Object.assign({}, state, {
            byAction: Object.assign({}, state.byAction, {
                [action.meta.actionId]: action.payload.data.data,
            })
        });
    }
    else if (action.type == types.DELETE_ACTION_RESPONSE + '_FULFILLED') {
        const actionId = action.meta.actionId;
        const responses = (state.byAction[actionId] || []);

        return Object.assign({}, state, {
            byAction: {
                [actionId]: responses
                    .filter(r => r.person.id != action.meta.personId),
            }
        });
    }
    else {
        return state || {
            byAction: {},
        };
    }
}
