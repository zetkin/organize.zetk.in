import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { retrieveCall } from '../../actions/call';


@connect(state => ({ calls: state.calls }))
export default class CallPane extends PaneBase {
    componentDidMount() {
        let callId = this.getParam(0);
        this.props.dispatch(retrieveCall(callId));
    }

    getRenderData() {
        let callId = this.getParam(0);
        let callList = this.props.calls.callList;

        return {
            callItem: getListItemById(callList, callId),
        };
    }

    getPaneTitle(data) {
        if (data.callItem && !data.callItem.isPending) {
            return 'Call to ' + data.callItem.data.target.name;
        }
        else {
            return 'Call';
        }
    }

    getPaneSubTitle(data) {
        if (data.callItem && !data.callItem.isPending) {
            let call = data.callItem.data;
            let date = Date.utc.create(call.allocation_time);
            return 'Made by ' + call.caller.name + ' on ' + date.long();
        }
    }

    renderPaneContent(data) {
        return [];
    }
}
