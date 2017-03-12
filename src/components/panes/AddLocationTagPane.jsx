import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationTagForm from '../forms/LocationTagForm';
import Button from '../misc/Button';
import { createLocationTag } from '../../actions/locationTag';

@connect(state => state)
@injectIntl
export default class AddLocationTagPane extends PaneBase {
    getPaneTitle(data) {
        return this.props.intl
            .formatMessage({ id: 'panes.addLocationTag.title' });
    }

    renderPaneContent(data) {
        const initialData = {
            title: this.getParam(0)
        };

        return (
            <LocationTagForm ref="form" tag={ initialData }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button
                labelMsg="panes.addPersonTag.saveButton"
                onClick={ this.onSubmit.bind(this) }
                className="AddLocationTagPane-saveButton"/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getValues();

        this.props.dispatch(createLocationTag(values));
        this.closePane();
    }
}