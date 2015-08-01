import { Store } from 'flummox';


export default class ParticipantStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;
        this.setState({
            participants: {}
        });

        var participantActions = this.flux.getActions('participant');
        this.registerAsync(participantActions.retrieveParticipants,
            this.onRetrieveParticipantsBegin,
            this.onRetrieveParticipantsComplete);

        this.register(participantActions.moveParticipant,
            this.onMoveParticipant);
    }

    getParticipants(actionId) {
        if (actionId in this.state.participants) {
            return this.state.participants[actionId];
        }
        else {
            return null;
        }
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
            participants: this.state.participants
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
