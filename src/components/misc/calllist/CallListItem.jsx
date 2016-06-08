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
                    { call.state }</span>
            </li>
        );
    }
}
