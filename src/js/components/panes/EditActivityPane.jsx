import React from 'react';

import PaneBase from './PaneBase';
import ActivityForm from '../forms/ActivityForm';


export default class EditActivityPane extends PaneBase {
    componentDidMount() {
        this.listenTo('activity', this.forceUpdate);
    }

    getRenderData() {
        const activityId = this.props.params[0];
        const activityStore = this.getStore('activity');

        return {
            activity: activityStore.getActivity(activityId)
        }
    }

    getPaneTitle(data) {
        return 'Edit activity';
    }

    renderPaneContent(data) {
        if (data.activity) {
            return [
                <ActivityForm key="form" ref="form" activity={ data.activity }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <input key="delete" type="button" value="Delete"
                    onClick={ this.onDeleteClick.bind(this) }/>
            ];
        }
        else {
            // TODO: Show loading indicator?
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getChangedValues();
        const activityId = this.props.params[0];

        this.getActions('activity')
            .updateActivity(activityId, values)
            .then(this.closePane.bind(this));
    }

    onDeleteClick(ev) {
        const activityId = this.props.params[0];

        this.getActions('activity').deleteActivity(activityId);
        this.closePane();
    }
}
