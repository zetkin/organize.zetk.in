import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import CallList from '../../lists/CallList';
import RootPaneBase from '../RootPaneBase';
import SelectInput from '../../forms/inputs/SelectInput';
import { retrieveCalls } from '../../../actions/call';


const mapStateToProps = state => ({
    callList: state.calls.callList,
});

@connect(mapStateToProps)
export default class CallLogPane extends RootPaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveCalls());
    }

    getRenderData() {
        return {
            callList: this.props.callList,
        };
    }

    getPaneFilters(data, filters) {
        let oaOptions = {
            'all': 'panes.callLog.filters.oa.options.all',
            'needed': 'panes.callLog.filters.oa.options.needed',
            'taken': 'panes.callLog.filters.oa.options.taken',
            'notTaken': 'panes.callLog.filters.oa.options.notTaken',
        };

        return [
            <div key="oa">
                <Msg tagName="label" id="panes.callLog.filters.oa.label"/>
                <SelectInput name="oa" options={ oaOptions }
                    value={ filters.oa || 'all' }
                    optionLabelsAreMessages={ true }
                    onValueChange={ this.onFilterChange.bind(this) }/>
            </div>
        ];
    }

    renderPaneContent(data) {
        return [
            <CallList key="list" callList={ data.callList }
                onLoadPage={ this.onLoadPage.bind(this) }
                onItemClick={ this.onItemClick.bind(this) }/>
        ];
    }

    onItemClick(item) {
        let call = item.data;
        this.openPane('call', call.id);
    }

    onFiltersApply(filters) {
        this.setState({ filters });

        this.props.dispatch(retrieveCalls(0, filters));
    }

    onLoadPage(page) {
        this.props.dispatch(retrieveCalls(page, this.state.filters));
    }
}
