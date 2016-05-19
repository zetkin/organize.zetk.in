import React from 'react';

import SelectInput from '../../../forms/inputs/SelectInput';
import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    let options = {
        '3': 'three',
        '6': 'six',
        '12': 'twelve'
    };

    return (
        <AssignmentTemplate type="stayintouch"
            title="Stay in touch" onCreate={ props.onCreate }>
            Call everyone once every
            <SelectInput name="interval"
                initialValue="6"
                options={ options }/>
            months, just to stay in touch.
        </AssignmentTemplate>
    );
}
