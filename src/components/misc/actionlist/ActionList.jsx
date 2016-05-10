import React from 'react';


import ActionListItem from './ActionListItem';
import { updateAction } from '../../../actions/action';
import { addActionParticipant } from '../../../actions/participant';


export default class ActionList extends React.Component {
    render() {
        var actions = this.props.actions;
        return (
            <div className="ActionList">
                <ul className="ActionList-columns">
                    <li>Time</li>
                    <li>Activity / Location</li>
                    <li>Contact</li>
                    <li>Participants</li>
                </ul>
                <ul className="ActionList-items">
                    {actions.map(function(action) {
                        const onOperation = this.onOperation.bind(this, action);
                        const onSetContact = this.onSetContact.bind(this, action);
                        const onAddParticipant =
                            this.onAddParticipant.bind(this, action);
                        const onMoveParticipant =
                            this.onMoveParticipant.bind(this, action);

                        let participantStore = this.props.participants;
                        let participants = participantStore.byAction[action.id];

                        return (
                            <ActionListItem key={ action.id }
                                dispatch={ this.props.dispatch }
                                onSetContact={ onSetContact }
                                onAddParticipant={ onAddParticipant }
                                onMoveParticipant={ onMoveParticipant }
                                onOperation={ onOperation }
                                participants={ participants }
                                action={ action }/>
                        );
                    }, this)}
                </ul>
            </div>
        );
    }

    onOperation(action, operation) {
        if (this.props.onActionOperation) {
            this.props.onActionOperation(action, operation);
        }
    }

    onSetContact(action, person, oldAction) {
        this.props.dispatch(updateAction(action.id, {
            contact_id: person.id
        }));

        if (action.id != oldAction.id) {
            // TODO: Remove from old action
        }
    }

    onAddParticipant(action, person) {
        this.props.dispatch(addActionParticipant(person.id, action.id));
    }

    onMoveParticipant(action, person, oldAction) {
        if (this.props.onMoveParticipant) {
            this.props.onMoveParticipant(action, person, oldAction);
        }
    }
}

ActionList.propTypes = {
    actions: React.PropTypes.array.isRequired,
    onMoveParticipant: React.PropTypes.func,
    onActionOperation: React.PropTypes.func
};
