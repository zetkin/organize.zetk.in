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
        return (
            <ul>
            {data.moves.map(function(move) {
                var key = [move.person, move.from, move.to].join(',');
                return (
                    <li key={ key }>{ key }</li>
                );
            }, this)}
            </ul>
        );
    }
}
