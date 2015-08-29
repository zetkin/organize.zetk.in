import React from 'react/addons';

import ParticipantItem from './ParticipantItem';


export default class ParticipantList extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.participants
            && nextProps.participants != this.props.participants);
    }

    render() {
        const participants = this.props.participants || [];
        const action = this.props.action;

        return (
            <ul className="participants">
            {participants.map(function(person) {
                return (
                    <ParticipantItem key={ person.id }
                        action={ action } person={ person }/>
                );
            }, this)}
            </ul>
        );
    }
}

ParticipantList.propTypes = {
    action: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired
    }),
    participants: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        first_name: React.PropTypes.string.isRequired,
        last_name: React.PropTypes.string.isRequired
    }))
};
