import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import getDate from '../../../../utils/getDate'

export default function DateColumnValue(props) {
    if(props.value) {
        const date = getDate(props.value);
        if(date) {
            return (
                <span>{ date }</span>
            );
        }
        return (
            <Msg id="panes.import.settings.date.invalid" />
        );
    }
    return null;
}
