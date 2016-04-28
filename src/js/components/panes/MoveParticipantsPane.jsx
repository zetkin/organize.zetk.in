import React from 'react';

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
            <button onClick={ this.onExecuteClick.bind(this) }>
                Confirm all</button>,
            <button onClick={ this.onResetClick.bind(this) }>
                Cancel all</button>,
            <ul className="MoveParticipantsPane-moveList">
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

                        <button onClick={ this.onMoveConfirm.bind(this, move) }>
                            Confirm</button>
                        <button onClick={ this.onMoveCancel.bind(this, move) }>
                            Cancel</button>
                    </li>
                );
            }, this)}
            </ul>
        ];
    }

    onPersonClick(person) {
        this.openPane('person', person.id);
    }

    onMoveConfirm(move) {
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
