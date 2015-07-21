import React from 'react/addons';

import SectionBase from '../SectionBase';


export default class PeopleSection extends SectionBase {
    getSubSections() {
        return [
            { title: 'People' },
            { title: 'Join requests' },
            { title: 'Invite' }
        ];
    }

    renderSectionContent() {
        return <h1>People</h1>;
    }
}
