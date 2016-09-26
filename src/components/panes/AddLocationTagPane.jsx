import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LocationTagForm from '../forms/LocationTagForm';
import Button from '../misc/Button';
import { createLocationTag } from '../../actions/locationTag';

@connect(state => state)
export default class AddLocationTagPane extends PaneBase {
    getPaneTitle(data) {
        return 'Add location tag';
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
            <Button label="Add tag"
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