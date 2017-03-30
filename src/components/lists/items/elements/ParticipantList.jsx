import React from 'react';

import ParticipantItem from './ParticipantItem';


export default class ParticipantList extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return (!!nextProps.participants
            && nextProps.participants != this.props.participants);
    }

    render() {
        const action = this.props.action;
        const maxVisible = this.props.maxVisible;
        const participants = this.props.participants || [];

        var moreItem = null;

        if (maxVisible && participants.length > maxVisible) {
            const numAdditional = participants.length - (maxVisible - 1);

            moreItem = (
                <li className="ParticipantList-moreParticipants"
                    onClick={ this.props.onShowAll }>
                    { numAdditional }
                </li>
            );
        }

        return (
            <ul className="ParticipantList">
            {participants.map(function(person, idx) {
                return (
                    <ParticipantItem key={ person.id }
                        action={ action } person={ person }/>
                );
            }, this)}
                { moreItem }
            </ul>
        );
    }
}

ParticipantList.propTypes = {
    maxVisible: React.PropTypes.number,
    onShowAll: React.PropTypes.func,
    action: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired
    }),
    participants: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        first_name: React.PropTypes.string.isRequired,
        last_name: React.PropTypes.string.isRequired
    }))
};
