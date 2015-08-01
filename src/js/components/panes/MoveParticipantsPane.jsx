import React from 'react/addons';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';


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
        return [
            <ul>
            {data.moves.map(function(move) {
                var key = [move.person, move.from, move.to].join(',');
                return (
                    <li key={ key }>{ key }</li>
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
