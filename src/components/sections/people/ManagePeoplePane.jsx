import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveQueries } from '../../../actions/query';


const mapStateToProps = state => ({
    queryList: state.queries.queryList,
});


@connect(mapStateToProps)
@injectIntl
export default class ManagePeoplePane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'queries',
        };
    }

    componentDidMount() {
        super.componentDidMount();

        // TODO: Do this only for queries tab
        this.props.dispatch(retrieveQueries());
    }

    getRenderData() {
    }

    renderPaneContent(data) {
        if (this.state.viewMode == 'queries') {
        }
        else if (this.state.viewMode == 'tags') {
        }
        else if (this.state.viewMode == 'dupliactes') {
        }
    }

    getPaneTools(data) {
        const viewStates = {
            'queries': 'panes.managePeople.viewMode.queries',
            'tags': 'panes.managePeople.viewMode.tags',
            'duplicates': 'panes.managePeople.viewMode.duplicates',
        };

        return [
            <ViewSwitch key="viewSwitch"
                states={ viewStates } selected={ this.state.viewMode }
                onSwitch={ vs => this.setState({ viewMode: vs }) }
                />,
        ];
    }
}
