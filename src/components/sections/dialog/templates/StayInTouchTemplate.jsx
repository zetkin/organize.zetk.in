import React from 'react';

import SelectInput from '../../../forms/inputs/SelectInput';
import AssignmentTemplate from './AssignmentTemplate';


export default function StayInTouchTemplate(props) {
    let options = {
        '90': 'three',
        '180': 'six',
        '365': 'twelve'
    };

    return (
        <AssignmentTemplate type="stayintouch"
            title="Stay in touch" onCreate={ props.onCreate }>
            Call everyone once every
            <SelectInput name="interval"
                initialValue="180"
                options={ options }/>
            months, just to stay in touch.
        </AssignmentTemplate>
    );
}
