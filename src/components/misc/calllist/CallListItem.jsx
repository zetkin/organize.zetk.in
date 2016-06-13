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

                <span className={ "CallListItem-callIcon " + stateClass } title={ stateLabel }/>
                <Avatar className="CallListItem-targetAvatar"
                    person={ call.target }/>
                <span className="CallListItem-target">
                    { call.target.name }</span>
                <div className="CallListItem-callInfo">
                    <Avatar className="CallListItem-callerAvatar"
                        person={ call.caller }/>
                    <span className="CallListItem-caller">
                        { call.caller.name }</span>
                    <span className="CallListItem-time">
                        { timestamp.long() }</span>
                </div>
            </li>
        );
    }
}
