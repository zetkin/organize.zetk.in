import React from 'react';

import SectionBase from '../SectionBase';
import AllCallAssignmentsPane from './AllCallAssignmentsPane';
import CallAssignmentTemplatePane from './CallAssignmentTemplatePane';


export default class DialogSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'assignments', title: 'Assignments',
                startPane: AllCallAssignmentsPane },
            { path: 'startassignment', title: 'Assignment templates',
                startPane: CallAssignmentTemplatePane },
        ];
    }
}
