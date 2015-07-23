import React from 'react/addons';

import SectionBase from '../SectionBase';
import PeopleListPane from './PeopleListPane';
import JoinRequestsPane from './JoinRequestsPane';
import InvitePane from './InvitePane';


export default class PeopleSection extends SectionBase {
    getBasePath() {
        return '/people';
    }

    getSubSections() {
        return [
            { path: '/requests', title: 'Join requests',
                startPane: JoinRequestsPane },

            { path: '/invite', title: 'Invite',
                startPane: InvitePane },

            { path: '/', title: 'People',
                startPane: PeopleListPane }
        ];
    }
}
