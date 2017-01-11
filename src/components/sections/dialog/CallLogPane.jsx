import React from 'react';
import { connect } from 'react-redux';

import CallList from '../../lists/CallList';
import RootPaneBase from '../RootPaneBase';
import { retrieveCalls } from '../../../actions/call';


@connect(state => state)
export default class CallLogPane extends RootPaneBase {
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
                onItemClick={ this.onItemClick.bind(this) }/>
        ];
    }

    onItemClick(item) {
        let call = item.data;
        this.openPane('call', call.id);
    }
}
