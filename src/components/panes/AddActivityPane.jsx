import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import ActivityForm from '../forms/ActivityForm';
import { createActivity } from '../../actions/activity';


@connect(state => state)
@injectIntl
export default class AddActivityPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.addActivity.title' });
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

    renderPaneFooter(data) {
        return (
            <Button className="AddActivityPane-saveButton"
                labelMsg="panes.addActivity.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();
        const activityId = this.getParam(0);

        this.props.dispatch(createActivity(values));
        this.closePane();
    }
}
