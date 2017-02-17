import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
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
@injectIntl
export default class MoveParticipantsPane extends PaneBase {
    getRenderData() {
        var participantStore = this.props.participants;

        return {
            moves: participantStore.moves,
        };
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.moveParticipants.title' });
    }

    renderPaneContent(data) {
        let actionList = this.props.actions.actionList;
        let personList = this.props.people.personList;

        return [
            <Button key="confirmAllButton"
                labelMsg="panes.moveParticipants.confirmAllButton"
                onClick={ this.onExecuteClick.bind(this) }/>,
            <Button key="cancelAllButton"
                labelMsg="panes.moveParticipants.cancelAllButton"
                onClick={ this.onResetClick.bind(this) }/>,
            <ul key="moveList" className="MoveParticipantsPane-moveList">
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

                        <Button
                            labelMsg="panes.moveParticipants.move.confirmButton"
                            onClick={ this.onMoveConfirm.bind(this, move) }/>
                        <Button
                            labelMsg="panes.moveParticipants.move.cancelButton"
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
