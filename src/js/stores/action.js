import { Store } from 'flummox';


export default class ActionStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            actions: []
        });

        var actionActions = flux.getActions('action');
        this.register(actionActions.retrieveAllActions,
            this.onRetrieveAllActionsComplete);
    }

    getAction(id) {
        return this.state.actions.find(a => (a.id == id));
    }

    getActions() {
        return this.state.actions;
    }

    onRetrieveAllActionsComplete(res) {
        this.setState({
            actions: res.data.data
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
