import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    return (
        <AssignmentTemplate type="inform"
            messagePath="panes.addCallAssignment.templates"
            selected={ props.selected }
            onSelect={ props.onSelect }/>
    );
}
