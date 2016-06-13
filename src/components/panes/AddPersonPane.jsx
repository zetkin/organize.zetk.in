import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import Button from '../misc/Button';
import { createPerson } from '../../actions/person';


@connect(state => state)
export default class AddPersonPane extends PaneBase {
    getPaneTitle(data) {
        return "Add person";
    }

    renderPaneContent(data) {
        return (
            <PersonForm ref="personForm"
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddPersonPane-saveButton"
                label="Save Person"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        var form = this.refs.personForm;
        var values = form.getValues();

        this.props.dispatch(createPerson(values));

        // TODO: Somehow navigate to new person
    }
}
