import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';


const mapStateToProps = state => ({
});

@connect(mapStateToProps)
@injectIntl
export default class AllVisitsPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            viewMode: 'route',
        };
    }

    componentDidMount() {
    }

    getRenderData() {
        return {
        };
    }

    getPaneFilters(data, filters) {
        return null;
    }

    getPaneTools(data) {
        let viewModes = {
            browse: 'panes.allVisits.viewModes.route',
            select: 'panes.allVisits.viewModes.address',
        };

        return [
            <ViewSwitch key="viewMode"
                states={ viewModes } selected={ this.state.viewMode }
                onSwitch={ this.onViewStateSwitch.bind(this) }
                />,
        ]
    }

    renderPaneContent(data) {
        return null;
    }

    onViewStateSwitch(state) {
        this.setState({
            viewMode: state,
        });
    }

    onFiltersApply(filters) {
    }
}
