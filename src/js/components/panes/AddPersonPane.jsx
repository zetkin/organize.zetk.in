import React from 'react/addons';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';


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

    onSubmit(ev) {
        ev.preventDefault();

        var form = this.refs.personForm;
        var values = form.getValues();

        this.getActions('person').createPerson(values);
    }
}
