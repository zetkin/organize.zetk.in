import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    return (
        <AssignmentTemplate type="inform"
            selected={ props.selected }
            onSelect={ props.onSelect }/>
    );
}
