import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { retrieveCall } from '../../actions/call';


@connect(state => ({ calls: state.calls }))
@injectIntl
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
        const formatMessage = this.props.intl.formatMessage;
        if (data.callItem && !data.callItem.isPending) {
            return formatMessage(
                { id: 'panes.call.title' },
                { targetName: data.callItem.data.target.name });
        }
        else {
            return formatMessage({ id: 'panes.call.pendingTitle' });
        }
    }

    getPaneSubTitle(data) {
        const formatMessage = this.props.intl.formatMessage;

        if (data.callItem && !data.callItem.isPending) {
            let call = data.callItem.data;
            let date = Date.utc.create(call.allocation_time);
            return formatMessage({ id: 'panes.call.subTitle' }, {
                callerName: call.caller.name,
                date: date.long(),
            });
        }
    }

    renderPaneContent(data) {
        if (data.callItem) {
            return [
                <Msg tagName="h3" key="notesHeader"
                    id="panes.call.notesHeader"/>,
                <p key="notes">
                    { data.callItem.data.notes }
                </p>
            ];
        }
        else {
            // TODO: Loading indicator?
            return null;
        }
    }
}
