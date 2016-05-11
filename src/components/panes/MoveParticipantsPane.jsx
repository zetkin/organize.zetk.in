import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import Person from '../misc/elements/Person';
import Action from '../misc/elements/Action';
import { getListItemById } from '../../utils/store';
import {
    executeActionParticipantMoves,
    undoActionParticipantMoves,
} from '../../actions/participant';


@connect(state => state)
export default class MoveParticipantsPane extends PaneBase {
    getRenderData() {
        var participantStore = this.props.participants;

        return {
            moves: participantStore.moves,
        };
    }

    getPaneTitle(data) {
        return 'Move participants';
    }

    renderPaneContent(data) {
        let actionList = this.props.actions.actionList;
        let personList = this.props.people.personList;

        return [
            <button onClick={ this.onExecuteClick.bind(this) }>
                Confirm all</button>,
            <button onClick={ this.onResetClick.bind(this) }>
                Cancel all</button>,
            <ul className="MoveParticipantsPane-moveList">
            {data.moves.map(function(move) {
                const key = [move.person, move.from, move.to].join(',');
                const person = getListItemById(personList, move.person).data;
                const fromAction = getListItemById(actionList, move.from).data;
                const toAction = getListItemById(actionList, move.to).data;

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
        this.props.dispatch(executeActionParticipantMoves([ move ]));
    }

    onMoveCancel(move) {
        this.props.dispatch(undoActionParticipantMoves([ move ]));
    }

    onExecuteClick(ev) {
        let participantStore = this.props.participants;
        let moves = participantStore.moves;

        this.props.dispatch(executeActionParticipantMoves(moves));
    }

    onResetClick(ev) {
        let participantStore = this.props.participants;
        let moves = participantStore.moves;

        this.props.dispatch(undoActionParticipantMoves(moves));

        this.closePane();
    }
}
