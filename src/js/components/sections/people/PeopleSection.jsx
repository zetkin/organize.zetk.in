import React from 'react';

import SectionBase from '../SectionBase';
import PeopleListPane from './PeopleListPane';
import JoinRequestsPane from './JoinRequestsPane';
import InvitePane from './InvitePane';


export default class PeopleSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'list', title: 'People',
                startPane: PeopleListPane },

            { path: 'requests', title: 'Join requests',
                startPane: JoinRequestsPane },

            { path: 'invite', title: 'Invite',
                startPane: InvitePane },
        ];
    }
}
