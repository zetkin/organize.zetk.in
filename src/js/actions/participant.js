import { Actions } from 'flummox';
import Z from 'zetkin';


export default class ParticipantActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveParticipants(actionId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', actionId, 'participants')
                .meta('actionId', actionId)
                .get();
    }

    moveParticipant(personId, oldActionId, newActionId) {
        return {
            personId: personId,
            oldActionId: oldActionId,
            newActionId: newActionId
        };
    }

    executeMoves(moves) {
        var i;
        var orgId = this.flux.getStore('org').getActiveId();
        var apiCalls = [];

        // TODO: Make some server-side batch executer for this?
        for (i in moves) {
            var move = moves[i];
            apiCalls.push(Z.resource('orgs', orgId, 'actions',
                move.from, 'participants', move.person).del());
            apiCalls.push(Z.resource('orgs', orgId, 'actions',
                move.to, 'participants', move.person).put());
        }

        return Promise.all(apiCalls);
    }

    clearMoves() {
        return true;
    }
}
