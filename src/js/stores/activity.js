import { Store } from 'flummox';


export default class ActivityStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            activities: []
        });

        var activityActions = flux.getActions('activity');
        this.register(activityActions.retrieveActivities,
            this.onRetrieveActivitiesComplete);
    }

    getActivity(id) {
        return this.state.activities.find(a => (a.id == id));
    }

    getActivities() {
        return this.state.activities;
    }

    onRetrieveActivitiesComplete(res) {
        this.setState({
            activities: res.data.data
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
