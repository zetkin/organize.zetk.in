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

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
