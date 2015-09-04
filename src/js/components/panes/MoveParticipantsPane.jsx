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
            <input type="button" value="Execute all"
                onClick={ this.onExecuteClick.bind(this) }/>,
            <input type="button" value="Reset all and cancel"
                onClick={ this.onResetClick.bind(this) }/>,
            <ul className="movelist">
            {data.moves.map(function(move) {
                const key = [move.person, move.from, move.to].join(',');
                const person = peopleStore.getPerson(move.person);
                const fromAction = actionStore.getAction(move.from);
                const toAction = actionStore.getAction(move.to);

                return (
                    <li key={ key }>
                        <Person person={ person }
                            onClick={ this.onPersonClick.bind(this, person) }/>
                        <Action action={ fromAction }/>
                        <Action action={ toAction }/>

                        <input type="button" value="Execute"
                            onClick={ this.onMoveExecute.bind(this, move) }/>
                        <input type="button" value="Cancel"
                            onClick={ this.onMoveCancel.bind(this, move) }/>
                    </li>
                );
            }, this)}
            </ul>
        ];
    }

    onPersonClick(person) {
        this.openPane('person', person.id);
    }

    onMoveExecute(move) {
        const participantActions = this.getActions('participant');

        participantActions.executeMoves([ move ]);
    }

    onMoveCancel(move) {
        const participantActions = this.getActions('participant');

        participantActions.undoMoves([ move ]);
    }

    onExecuteClick(ev) {
        const participantActions = this.getActions('participant');
        const participantStore = this.getStore('participant');
        const moves = participantStore.getMoves();

        participantActions.executeMoves(moves);
    }

    onResetClick(ev) {
        const participantActions = this.getActions('participant');
        const participantStore = this.getStore('participant');
        const moves = participantStore.getMoves();

        participantActions.undoMoves(moves);

        this.closePane();
    }
}
