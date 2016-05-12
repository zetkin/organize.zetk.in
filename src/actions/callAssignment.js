import * as types from '.';

import makeRandomString from '../utils/makeRandomString';


export function createCallAssignmentDraft(type, config) {
    let assignment = {
        // Prepend ID with $ to designate draft
        id: '$' + makeRandomString(6),
        filter_spec: [],
    };

    // TODO: Improve these suggestions
    switch (type) {
        case 'stayintouch':
            assignment.title = 'Stay in touch';
            assignment.description = 'Stay in touch every ' +
                config.interval + ' months';
            break;

        case 'inform':
            assignment.title = 'Inform';
            assignment.description = '(No description)';
            break;

        case 'mobilize':
            assignment.title = config.campaign.title;
            assignment.description = 'Mobilize activists for campaign "' +
                config.campaign.title + '"';
            break;

        case 'survey':
            // TODO: Implement this
            break;
    }

    return {
        type: types.CREATE_CALL_ASSIGNMENT_DRAFT,
        payload: { assignment },
    };
}
