import React from 'react/addons';

import FluxComponent from '../../FluxComponent';
import ActionListItem from './ActionListItem';


export default class ActionList extends FluxComponent {
    render() {
        var actions = this.props.actions;
        return (
            <div className="actionlist">
                <ul className="actionlist-columns">
                    <li>Time</li>
                    <li>Activity / Location</li>
                    <li>Contact</li>
                    <li>Participants</li>
                </ul>
                <ul className="actionlist-items">
                    {actions.map(function(action) {
                        var onOperation = this.onOperation.bind(this, action);
                        var onMoveParticipant =
                            this.onMoveParticipant.bind(this, action);

                        return (
                            <ActionListItem key={ action.id }
                                onMoveParticipant={ onMoveParticipant }
                                onOperation={ onOperation }
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

    onMoveParticipant(action, person, oldAction) {
        this.getActions('participant').moveParticipant(
            person.id, oldAction.id, action.id);
    }
}

ActionList.propTypes = {
    actions: React.PropTypes.array.isRequired,
    onActionOperation: React.PropTypes.func
};
