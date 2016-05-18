import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    return (
        <AssignmentTemplate type="inform"
            title="Inform" image=""
            onCreate={ props.onCreate }>
            Call everyone once.
        </AssignmentTemplate>
    );
}
