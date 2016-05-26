import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonTagForm from '../forms/PersonTagForm';
import { createPersonTag } from '../../actions/personTag';


@connect(state => state)
export default class AddPersonTagPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add person tag';
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <PersonTagForm ref="form" activity={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const values = this.refs.form.getValues();
        const activityId = this.props.params[0];

        this.props.dispatch(createPersonTag(values));
        this.closePane();
    }
}
