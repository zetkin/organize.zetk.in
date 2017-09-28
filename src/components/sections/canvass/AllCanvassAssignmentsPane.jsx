import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';


const mapStateToProps = state => ({
});

@connect(mapStateToProps)
@injectIntl
export default class AllCanvassAssignmentsPane extends RootPaneBase {
    componentDidMount() {
    }

    getRenderData() {
        return {
        };
    }

    getPaneFilters(data, filters) {
        return null;
    }

    renderPaneContent(data) {
        return null;
    }

    onFiltersApply(filters) {
    }
}
