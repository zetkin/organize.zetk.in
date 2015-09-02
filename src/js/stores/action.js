import { Store } from 'flummox';

import StoreUtils from '../utils/StoreUtils';


function sortActions(actions) {
    return actions.sort((a0, a1) =>
        (new Date(a0.start_time).getTime() + 0.1 * a0.id) -
        (new Date(a1.start_time).getTime() + 0.1 * a1.id));
}

export default class ActionStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;

        this.setState({
            actions: []
        });

        var actionActions = flux.getActions('action');
        this.register(actionActions.createAction,
            this.onCreateActionComplete);
        this.register(actionActions.retrieveAllActions,
            this.onRetrieveAllActionsComplete);
        this.register(actionActions.retrieveAction,
            this.onRetrieveActionComplete);
        this.register(actionActions.updateAction,
            this.onUpdateActionComplete);

        this.register(actionActions.highlightActionPhase,
            this.onHighlightActionPhase);
        this.register(actionActions.highlightActionLocation,
            this.onHighlightActionLocation);
        this.register(actionActions.highlightActions,
            this.onHighlightActions);
        this.register(actionActions.clearActionHighlights,
            this.onClearActionHighlights);
    }

    getAction(id) {
        return this.state.actions.find(a => (a.id == id));
    }

    getActions() {
        const campaignStore = this.flux.getStore('campaign');
        const campaign = campaignStore.getSelectedCampaign();

        if (campaign) {
            return this.state.actions.filter(action =>
                (action.campaign.id == campaign.id))
        }
        else {
            return this.state.actions;
        }
    }

    onCreateActionComplete(res) {
        const action = res.data.data;

        this.setState({
            actions: sortActions(this.state.actions.concat([ action ]))
        });
    }

    onRetrieveAllActionsComplete(res) {
        this.setState({
            actions: sortActions(res.data.data)
        });
    }

    onRetrieveActionComplete(res) {
        var action = res.data.data;
        StoreUtils.updateOrAdd(this.state.actions, action.id, action);

        this.setState({
            actions: sortActions(this.state.actions)
        });
    }

    onUpdateActionComplete(res) {
        var action = res.data.data;
        StoreUtils.updateOrAdd(this.state.actions, action.id, action);

        this.setState({
            actions: sortActions(this.state.actions)
        });
    }

    onHighlightActionPhase(payload) {
        this.setState({
            actions: this.state.actions.map(function(action) {
                action.highlight = (
                    action.location.id == payload.locId &&
                    actionIsPhase(action, payload.phase));

                return action;
            })
        });
    }

    onHighlightActionLocation(locId) {
        this.setState({
            actions: this.state.actions.map(function(action) {
                action.highlight = (action.location.id == locId);
                return action;
            })
        });
    }

    onHighlightActions(actionIds) {
        this.setState({
            actions: this.state.actions.map(function(action) {
                action.highlight = (actionIds.indexOf(action.id) >= 0);
                return action;
            })
        });
    }

    onClearActionHighlights() {
        this.setState({
            actions: this.state.actions.map(function(action) {
                action.highlight = false;
                return action;
            })
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}

function actionIsPhase(action, phase) {
    // TODO: Don't duplicate these constants in ActionLocationItem component
    const startTime = new Date(action.start_time);
    const hour = startTime.getUTCHours();

    if (hour <= 4 || hour > 22) {
        return phase == 4;
    }
    else if (hour <= 9) {
        return phase == 0;
    }
    else if (hour <= 13) {
        return phase == 1;
    }
    else if (hour <= 17) {
        return phase == 2;
    }
    else if (hour <= 22) {
        return phase == 3;
    }
}
