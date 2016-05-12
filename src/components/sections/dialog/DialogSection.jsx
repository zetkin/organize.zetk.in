import React from 'react';

import SectionBase from '../SectionBase';
import PlaceholderPane from './PlaceholderPane';
import CallAssignmentTemplatePane from './CallAssignmentTemplatePane';


export default class DialogSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'overview', title: 'Overview',
                startPane: PlaceholderPane },
            { path: 'startassignment', title: 'Assignment templates',
                startPane: CallAssignmentTemplatePane },
        ];
    }
}
