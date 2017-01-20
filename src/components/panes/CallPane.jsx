import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
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
            let call = data.callItem.data;
            let timestamp = Date.utc.create(call.allocation_time);

            let callerNote = null;
            let action = null;

            if (call.notes) {
                callerNote = <p>{ call.notes }</p>;
            }
            else {
                callerNote = (
                    <div className="empty">
                        <Msg tagName="p"
                            id="panes.call.note.noNote"/>
                    </div>
                );
            }

            if (call.organizer_action_taken || call.organizer_action_needed) {

                let actionStatus = null;
                let actionHeader = null;
                let actionMessage = null;
                let actionResponseButton = null;

                if (call.organizer_action_taken) {
                    actionStatus = "taken";
                    actionHeader = <Msg id="panes.call.action.header.taken"/>;
                    actionResponseButton = (
                        <Button className="CallPane-actionResponseButton"
                            labelMsg="panes.call.action.response.unresolve"
                            onClick=""/>
                        );
                }
                else if (call.organizer_action_needed) {
                    actionStatus = "needed";
                    actionHeader = <Msg id="panes.call.action.header.needed"/>;

                    actionResponseButton = (
                        <Button className="CallPane-actionResponseButton"
                            labelMsg="panes.call.action.response.resolve"
                            onClick=""/>
                        );
                }

                 let actionClassNames  = cx('CallPane-action', actionStatus );

                if (call.message_to_organizer) {
                    actionMessage = <p>{ call.message_to_organizer }</p>;
                }
                else {
                    actionMessage = (
                        <div className="empty">
                            <Msg tagName="p"
                                id="panes.call.action.content.noMessage"/>
                        </div>
                    );
                }

                action = (
                    <div className={ actionClassNames }>
                        <div className="CallPane-actionHeader">
                            { actionHeader }
                        </div>
                        <div className="CallPane-actionContent">
                            <Msg tagName="h3"
                                id="panes.call.action.content.header"/>
                            { actionMessage }
                        </div>
                        <div className="CallPane-actionResponse">
                            { actionResponseButton }
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    <div className="CallPane-target">
                        <Avatar key="targetAvatar" person={ call.target }/>
                        <h1 key="targetName" className="CallPane-targetName">
                            { call.target.name } </h1>
                    </div>
                    <div className="CallPane-caller">
                        <Avatar key="callerAvatar" className="CallPane-callerAvatar"
                            person={ call.caller }/>
                        <span key="callerName" className="CallPane-callerName">
                            { call.caller.name } </span>
                    </div>
                    <div className="CallPane-date">
                        { timestamp.format('{d}/{M}, {yyyy} {HH}:{MM}') }
                    </div>
                    <div className="CallPane-callerNote">
                        <Msg tagName="h3"
                            id="panes.call.note.header"/>
                        { callerNote }
                    </div>
                    { action }
                </div>
            );
        }
        else {
            // TODO: Loading indicator?
            return null;
        }
    }
}
