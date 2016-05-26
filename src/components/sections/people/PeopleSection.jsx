import React from 'react';

import ImportPane from './ImportPane';
import InvitePane from './InvitePane';
import JoinRequestsPane from './JoinRequestsPane';
import PeopleListPane from './PeopleListPane';
import SectionBase from '../SectionBase';


export default class PeopleSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'list', title: 'People',
                startPane: PeopleListPane },

            { path: 'requests', title: 'Join requests',
                startPane: JoinRequestsPane },

            { path: 'invite', title: 'Invite',
                startPane: InvitePane },

            { path: 'import', title: 'Import',
                startPane: ImportPane },
        ];
    }
}
