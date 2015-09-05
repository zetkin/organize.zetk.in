import React from 'react/addons';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import DraggableAvatar from '../misc/DraggableAvatar';


export default class PersonPane extends PaneBase {
    componentDidMount() {
        this.listenTo('person', this.forceUpdate);

        const personId = this.props.params[0];
        const person = this.getStore('person').getPerson(personId);

        if (!person) {
            this.getActions('person').retrievePerson(personId);
        }
    }

    getRenderData() {
        var personId = this.props.params[0];
        var personStore = this.getStore('person');

        return {
            person: personStore.getPerson(personId)
        }
    }

    getPaneTitle(data) {
        if (data.person) {
            return data.person.first_name + ' ' + data.person.last_name;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.person) {
            return [
                <DraggableAvatar ref="avatar" person={ data.person }/>,
                <PersonForm ref="personForm"
                    person={ data.person }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <input ref="submitButton" type="button" value="Delete"
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

        var form = this.refs.personForm;
        var values = form.getChangedValues();
        var personId = this.props.params[0];

        this.getActions('person')
            .updatePerson(personId, values)
            .then(this.closePane.bind(this));
    }

    onDeleteClick(ev) {
        var personId = this.props.params[0];

        this.getActions('person').deletePerson(personId);
        this.closePane();
    }
}
