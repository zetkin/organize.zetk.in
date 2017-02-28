import React from 'react';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import url from 'url';

import MatchBase from './MatchBase';


export default class ActionDayMatch extends MatchBase {
    getTitle() {
        let count = this.props.data.action_count;
        let dateValue = Date.create(this.props.data.date);

        let date = (
            <FormattedDate value={ dateValue }
                day="numeric"
                month="long"
                weekday="long"
                />
        );

        return (
            <Msg id="header.search.matches.actionDay"
                values={{ count, date }}/>
        );
    }
}
