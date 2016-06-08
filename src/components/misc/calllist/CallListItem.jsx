import React from 'react';

import Avatar from '../Avatar';


export default class CallListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        callItem: React.PropTypes.shape({
            isPending: React.PropTypes.bool,
            error: React.PropTypes.any,
            data: React.PropTypes.object,
        }).isRequired,
    };

    render() {
        let call = this.props.callItem.data;
        let timestamp = Date.utc.create(call.allocation_time);
        let stateClass = "CallListItem-state";
        let stateLabel = null;

        // TODO: Discuss appropriate labels and icons
        switch (call.state) {
            case 0:
                stateLabel = "Allocated"; stateClass += "Allocated";
                break;
            case 1:
                stateLabel = "Success"; stateClass += "Success";
                break;
            case 11:
                stateLabel = "Failed: No response"; stateClass += "Failed";
                break;
            case 12:
                stateLabel = "Failed: Line busy"; stateClass += "Failed";
                break;
            case 13:
                stateLabel = "Failed: Call back later"; stateClass += "Later";
                break;
            case 21:
                stateLabel = "Failed: Invalid number"; stateClass += "Warning";
                break;
            case 21:
                stateLabel = "Failed: Call dropped"; stateClass += "Warning";
                break;
        }

        return (
            <li className="CallListItem"
                onClick={ this.props.onSelect.bind(this, call) }>

                <Avatar className="CallListItem-callerAvatar"
                    person={ call.caller }/>
                <span className="CallListItem-caller">
                    { call.caller.name }</span>
                <span className="CallListItem-callIcon"/>
                <Avatar className="CallListItem-targetAvatar"
                    person={ call.target }/>
                <span className="CallListItem-target">
                    { call.target.name }</span>
                <span className="CallListItem-time">
                    { timestamp.long() }</span>
                <span className="CallListItem-status">
                    <span className={ stateClass } title={ stateLabel }/>
                </span>
            </li>
        );
    }
}
