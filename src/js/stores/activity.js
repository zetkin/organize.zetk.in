import { Store } from 'flummox';
import StoreUtils from '../utils/StoreUtils';


export default class ActivityStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            activities: []
        });

        var activityActions = flux.getActions('activity');
        this.register(activityActions.retrieveActivities,
            this.onRetrieveActivitiesComplete);
        this.register(activityActions.updateActivity,
            this.onUpdateActivityComplete);
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

    onUpdateActivityComplete(res) {
        const activity = res.data.data;

        StoreUtils.updateOrAdd(this.state.activities, activity.id, activity);

        this.setState({
            activities: this.state.activities
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
