import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';


export default class AllActivitiesPane extends PaneBase {
    getPaneTitle() {
        return 'Activities';
    }

    componentDidMount() {
        this.listenTo('activity', this.forceUpdate);
        this.getActions('activity').retrieveActivities();
    }

    renderPaneContent() {
        var activityStore = this.getStore('activity');
        var activities = activityStore.getActivities();

        return (
            <ul>
                {activities.map(function(a) {
                    return (
                        <li key={ a.id }>
                            { a.title }</li>
                    );
                }, this)}
            </ul>
        );
    }
}
