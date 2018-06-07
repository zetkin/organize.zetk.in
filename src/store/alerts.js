import * as types from '../actions';
import makeRandomString from '../utils/makeRandomString';


// Remove messages that are more than 30 seconds old
let cleanOldMessages = messages => {
    const now = new Date();
    return messages
        .filter(msg => (now - msg.time) < 8000);
};

export default function alerts(state = null, action) {
    const supportedErrors = [400, 403, 500];
    if (action.type.indexOf('_REJECTED') > 0) {
        if (supportedErrors.indexOf(action.payload.httpStatus) >= 0) {
            return Object.assign({}, state, {
                messages: cleanOldMessages(state.messages)
                    .concat([{
                        id: makeRandomString(),
                        time: new Date(),
                        type: 'error.rejected.http' + action.payload.httpStatus,
                        action: action,
                    }]),
            });
        }
    }
    else if (action.type == types.POLL_ALERT_MESSAGES) {
        return Object.assign({}, state, {
            messages: cleanOldMessages(state.messages),
        });
    }

    return state || {
        messages: [],
    };
}
