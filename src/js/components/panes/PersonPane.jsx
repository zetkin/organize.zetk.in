import React from 'react/addons';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';


export default class PersonPane extends PaneBase {
    componentDidMount() {
        this.listenTo('person', this.forceUpdate);
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
                <PersonForm ref="personForm"
                    person={ data.person }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <input type="button" value="Delete"
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

        this.getActions('person').updatePerson(personId, values);
    }

    onDeleteClick(ev) {
        var personId = this.props.params[0];

        this.getActions('person').deletePerson(personId);
        this.closePane();
    }
}
