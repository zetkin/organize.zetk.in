import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import MatchBase from './MatchBase';


export default class QueryMatch extends MatchBase {
    getTitle() {
        let values = {
            title: this.props.data.title,
        };

        return (
            <Msg id="header.search.matches.query"
                values={ values }/>
        );
    }
}
