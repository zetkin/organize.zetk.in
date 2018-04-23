import * as types from '.';


export function pollAlertMessages() {
    return {
        type: types.POLL_ALERT_MESSAGES,
    };
}
