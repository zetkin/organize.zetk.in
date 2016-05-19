import React from 'react';
import { connect } from 'react-redux';

import CallList from '../../misc/calllist/CallList';
import PaneBase from '../../panes/PaneBase';
import { retrieveCalls } from '../../../actions/call';


@connect(state => state)
export default class CallLogPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveCalls());
    }

    getRenderData() {
        return {
            callList: this.props.calls.callList,
        };
    }

    renderPaneContent(data) {
        return [
            <CallList key="list" callList={ data.callList }
                onSelect={ this.onSelect.bind(this) }/>
        ];
    }

    onSelect(call) {
        this.openPane('call', call.id);
    }
}
