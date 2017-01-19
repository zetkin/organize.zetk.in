import React from 'react';

import Avatar from '../../misc/Avatar';


export default class CallListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let call = this.props.data;
        let timestamp = new Date(call.allocation_time);
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
            <div className="CallListItem"
                onClick={ this.props.onItemClick.bind(this, call) }>
                <div className="ListItem-date">
                    <span className="date">
                        { timestamp.format('{d}/{M}, {yyyy}') }</span>
                    <span className="time">
                        { timestamp.format('{HH}:{mm}') }</span>
                </div>

                <div className="CallListItem-target">
                    <Avatar className="CallListItem-targetAvatar"
                        person={ call.target }/>
                    <span className="CallListItem-targetName">
                        { call.target.name }</span>
                </div>
                <div className="CallListItem-callInfo">
                    <span className={ "CallListItem-callStatus " + stateClass }
                        title={ stateLabel }>
                        { stateLabel }
                    </span>
                    <span className="CallListItem-caller">
                        { call.caller.name }</span>
                </div>
            </div>
        );
    }
}
