import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';

export default class AllFilter extends FilterBase {
    renderFilterForm(config) {
        return (
            <Msg id="filters.all.description"/>
        );
    }

    getConfig() {
        return {};
    }
}
