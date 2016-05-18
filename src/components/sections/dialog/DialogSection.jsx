import React from 'react';

import SectionBase from '../SectionBase';
import AllCallAssignmentsPane from './AllCallAssignmentsPane';
import CallAssignmentTemplatePane from './CallAssignmentTemplatePane';
import CallLogPane from './CallLogPane';


export default class DialogSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'assignments', title: 'Assignments',
                startPane: AllCallAssignmentsPane },
            { path: 'calls', title: 'Call log',
                startPane: CallLogPane },
            { path: 'startassignment', title: 'Assignment templates',
                startPane: CallAssignmentTemplatePane },
        ];
    }
}
