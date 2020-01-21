import { connect } from 'react-redux';
import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';
import { retrieveCall } from '../../../actions/call';

import Avatar from '../../misc/Avatar';

@connect()
export default class CallListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    componentDidUpdate(prevProps) {
        const call = this.props.data;

        if (this.props.inView && !prevProps.inView) {
            if (!call || call.message_to_organizer !== undefined) {
                return;
            }
            else if (call.organizer_action_needed) {
                this.props.dispatch(retrieveCall(call.id, true))
            }
        }
    }

    render() {
        let call = this.props.data;
        if (!call) return null;

        let timestamp = Date.create(call.allocation_time);
        let stateClass = "CallListItem-state";
        let stateLabel = null;
        let actionStatus = null;

        switch (call.state) {
            case 0:
                stateLabel = "lists.callList.item.status.allocated";
                stateClass += "Allocated";
                break;
            case 1:
                stateLabel = "lists.callList.item.status.reached";
                stateClass += "Success";
                break;
            default:
                stateLabel = "lists.callList.item.status.notReached";
                stateClass += "Failed";
        }

        if (call.organizer_action_taken) {
            actionStatus = "taken";
        }
        else if (call.organizer_action_needed) {
            actionStatus = "needed";
        }

        let actionClassNames  = cx('CallListItem-action', actionStatus );

        const messageIsPending = call.organizer_action_needed && call.message_to_organizer === undefined;

        const organizerMsgClassNames = cx('CallListItem-organizerMsg', {
            loading: messageIsPending,
            empty: call.message_to_organizer === null,
        })

        const truncateMessage = msg => {
            if (msg && msg.length > 180) {
                return msg.substr(0, 180) + '...';
            }
            else {
                return msg;
            }
        };

        return (
            <div className="CallListItem"
                onClick={ this.props.onItemClick.bind(this, call) }>
                <div className="ListItem-date">
                    <span className="date">
                        { timestamp.format('{d}/{M}, {yyyy}') }</span>
                    <span className="time">
                        { timestamp.format('{HH}:{mm}') }</span>
                </div>
                <div className="CallListItem-content">
                    <div className="CallListItem-target">
                        <Avatar className="CallListItem-targetAvatar"
                            person={ call.target }/>
                        <span className="CallListItem-targetName">
                            { call.target.name }</span>
                    </div>
                    <div className="CallListItem-callInfo">
                        <span className={ "CallListItem-callStatus "
                            + stateClass }>
                            <Msg id={ stateLabel.toString() }/>
                        </span>
                        <span className="CallListItem-caller">
                            { call.caller.name }</span>
                        { call.organizer_action_needed && (
                            <span className={ organizerMsgClassNames }>
                                { call.message_to_organizer === null ?
                                    <Msg tagName="span"
                                        id="lists.callList.item.organizerMsg.noMessage"/> :
                                    truncateMessage(call.message_to_organizer)
                                 }</span>
                        )}
                    </div>
                    <div className="CallListItem-callStatuses"/>
                    <div className="CallListItem-organizerStatuses"/>
                </div>
                <div className={ actionClassNames }></div>
            </div>
        );
    }
}
