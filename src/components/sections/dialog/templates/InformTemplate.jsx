import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    return (
        <AssignmentTemplate type="inform"
            title="Inform" onCreate={ props.onCreate }>
            Call everyone once, for example to inform them about something
            they should know.
        </AssignmentTemplate>
    );
}
