import React from 'react/addons';

import PaneBase from './PaneBase';
import ActivityForm from '../forms/ActivityForm';


export default class AddActivityPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add activity';
    }

    renderPaneContent(data) {
        return (
            <ActivityForm ref="form"
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();
        const activityId = this.props.params[0];

        // TODO: Go to edit pane when done?
        this.getActions('activity').createActivity(values);
    }
}
