import React from 'react/addons';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import Person from '../misc/elements/Person';
import Action from '../misc/elements/Action';


export default class MoveParticipantsPane extends PaneBase {
    componentDidMount() {
        this.listenTo('participant', this.forceUpdate);
    }

    getRenderData() {
        var participantStore = this.getStore('participant');

        return {
            moves: participantStore.getMoves()
        };
    }

    getPaneTitle(data) {
        return 'Move participants';
    }

    renderPaneContent(data) {
        const actionStore = this.getStore('action');
        const peopleStore = this.getStore('person');

        return [
            <ul className="movelist">
            {data.moves.map(function(move) {
                var key = [move.person, move.from, move.to].join(',');
                var person = peopleStore.getPerson(move.person);
                var fromAction = actionStore.getAction(move.from);
                var toAction = actionStore.getAction(move.to);

                return (
                    <li key={ key }>
                        <Person person={ person }/>
                        <Action action={ fromAction }/>
                        <Action action={ toAction }/>
                    </li>
                );
            }, this)}
            </ul>,
            <input type="button" value="Execute"
                onClick={ this.onExecuteClick.bind(this) }/>,
            <input type="button" value="Reset and cancel"
                onClick={ this.onResetClick.bind(this) }/>
        ];
    }

    onExecuteClick(ev) {
        const participantActions = this.getActions('participant');
        const participantStore = this.getStore('participant');
        const moves = participantStore.getMoves();

        participantActions.executeMoves(moves)
            .then(function() {
                participantActions.clearMoves();
                this.closePane();
            }.bind(this));
    }

    onResetClick(ev) {
        const participantActions = this.getActions('participant');
        const participantStore = this.getStore('participant');
        const moves = participantStore.getMoves();

        participantActions.undoMoves(moves);
        participantActions.clearMoves();

        this.closePane();
    }
}
