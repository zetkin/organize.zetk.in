import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    return (
        <AssignmentTemplate type="inform"
            onCreate={ props.onCreate }/>
    );
}
