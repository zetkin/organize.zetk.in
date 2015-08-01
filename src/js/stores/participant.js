import { Store } from 'flummox';


export default class ParticipantStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;
        this.setState({
            participants: {},
            moves: []
        });

        var participantActions = this.flux.getActions('participant');
        this.registerAsync(participantActions.retrieveParticipants,
            this.onRetrieveParticipantsBegin,
            this.onRetrieveParticipantsComplete);

        this.register(participantActions.moveParticipant,
            this.onMoveParticipant);
        this.register(participantActions.clearMoves,
            this.onClearMoves);
    }

    getParticipants(actionId) {
        if (actionId in this.state.participants) {
            return this.state.participants[actionId];
        }
        else {
            return null;
        }
    }

    getMoves() {
        return this.state.moves;
    }

    onRetrieveParticipantsBegin(actionId) {
        this.state.participants[actionId] = [];

        this.setState({
            participants: this.state.participants
        });
    }

    onRetrieveParticipantsComplete(res) {
        var actionId = res.meta.actionId;
        this.state.participants[actionId] = res.data.data;

        this.setState({
            participants: this.state.participants
        });
    }

    onMoveParticipant(payload) {
        var i, person;
        var oldArray = this.state.participants[payload.oldActionId];
        var newArray = this.state.participants[payload.newActionId];

        for (i in oldArray) {
            if (oldArray[i].id == payload.personId) {
                person = oldArray[i];
                oldArray.splice(i, 1);
                break;
            }
        }

        if (person) {
            newArray.push(person);
        }

        this.setState({
            participants: this.state.participants,
            moves: this.addMove({
                person: payload.personId,
                from: payload.oldActionId,
                to: payload.newActionId
            })
        });
    }

    onClearMoves() {
        this.setState({
            moves: []
        });
    }

    addMove(move) {
        var i;
        var oldMove;
        var updated = false;
        var moves = this.state.moves;

        // Search for inverses
        for (i in moves) {
            oldMove = moves[i];
            if (oldMove.person == move.person
                && oldMove.from == move.to && oldMove.to == move.from) {
                // This is an inverse of a previous move, i.e. it undos it,
                // and can thus just be removed since the result is no move.
                moves.splice(i, 1);
                updated = true;
                break;
            }
        }

        // Search for chain
        oldMove = moves.find(m =>
            (m.to == move.from && m.person == move.person));

        if (oldMove) {
            // This extends a chain of moves for this person. Just update the
            // previous move to avoid storing the entire chain.
            oldMove.to = move.to;
            updated = true;
        }

        // Search for replace
        oldMove = moves.find(m =>
            (m.from == move.to && m.person == move.person));

        if (oldMove) {
            // This moves the person to an action from which it was previously
            // moved away, i.e. A > B, C > A. In effect, there has only really
            // been one move made, C > B.
            oldMove.from = move.from;
            updated = true;
        }

        if (!updated) {
            // If no old move was updated this is a new move
            moves.push(move);
        }

        return moves;
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
