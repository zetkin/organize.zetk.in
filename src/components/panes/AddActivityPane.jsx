import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import ActivityForm from '../forms/ActivityForm';
import { createActivity } from '../../actions/activity';


@connect(state => state)
export default class AddActivityPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add activity';
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <ActivityForm ref="form" activity={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();
        const activityId = this.props.params[0];

        // TODO: Go to edit pane when done?
        this.props.dispatch(createActivity(values));
    }
}
