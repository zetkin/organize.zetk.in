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
        const activityStore = this.getStore('activity');
        const activities = activityStore.getActivities();

        return [
            <input type="button" value="Add"
                onClick={ this.onAddClick.bind(this) }/>,

            <ul>
                {activities.map(function(a) {
                    return (
                        <li key={ a.id }
                            onClick={ this.onActivityClick.bind(this, a) }>
                            { a.title }</li>
                    );
                }, this)}
            </ul>
        ];
    }

    onAddClick(ev) {
        this.gotoSubPane('addactivity');
    }

    onActivityClick(activity) {
        this.gotoSubPane('editactivity', activity.id);
    }
}
