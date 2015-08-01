import { Store } from 'flummox';

import StoreUtils from '../utils/StoreUtils';


export default class ActionStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            actions: []
        });

        var actionActions = flux.getActions('action');
        this.register(actionActions.retrieveAllActions,
            this.onRetrieveAllActionsComplete);
        this.register(actionActions.retrieveAction,
            this.onRetrieveActionComplete);
        this.register(actionActions.updateAction,
            this.onUpdateActionComplete);
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

    onRetrieveActionComplete(res) {
        var action = res.data.data;
        StoreUtils.updateOrAdd(this.state.actions, action.id, action);

        this.setState({
            actions: this.state.actions
        });
    }

    onUpdateActionComplete(res) {
        var action = res.data.data;
        StoreUtils.updateOrAdd(this.state.actions, action.id, action);

        this.setState({
            actions: this.state.actions
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
