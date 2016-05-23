import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import DraggableAvatar from '../misc/DraggableAvatar';
import { retrievePerson, updatePerson, deletePerson }
    from '../../actions/person';
import { getListItemById } from '../../utils/store';


@connect(state => state)
export default class EditPersonPane extends PaneBase {
    componentDidMount() {
        let personId = this.props.params[0];
        let person = getListItemById(this.props.people.personList, personId);

        if (!person) {
            this.props.dispatch(retrievePerson(personId));
        }
    }

    getRenderData() {
        let personId = this.props.params[0];

        return {
            personItem: getListItemById(this.props.people.personList, personId)
        }
    }

    getPaneTitle(data) {
        if (data.personItem) {
            let person = data.personItem.data;
            return person.first_name + ' ' + person.last_name;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.personItem) {
            if (data.personItem.isPending) {
                // TODO: Show proper loading indicator?
                return <h1>Loading</h1>;
            }
            else {
                return [
                    <PersonForm ref="personForm"
                        person={ data.personItem.data }
                        onSubmit={ this.onSubmit.bind(this) }/>,

                    <input ref="submitButton" type="button" value="Delete"
                        onClick={ this.onDeleteClick.bind(this) }/>
                ];
            }
        }
        else {
            // TODO: Show error?
            return <h1>HELO</h1>;
            return null;
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        let form = this.refs.personForm;
        let values = form.getChangedValues();
        let personId = this.props.params[0];

        this.props.dispatch(updatePerson(personId, values));
    }

    onDeleteClick(ev) {
        var personId = this.props.params[0];

        this.props.dispatch(deletePerson(personId));
        this.closePane();
    }
}
