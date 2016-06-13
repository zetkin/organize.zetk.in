import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import Button from '../misc/Button';
import DraggableAvatar from '../misc/DraggableAvatar';
import LoadingIndicator from '../misc/LoadingIndicator';
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
                return <LoadingIndicator/>;
            }
            else {
                return [
                    <PersonForm ref="personForm"
                        person={ data.personItem.data }
                        onSubmit={ this.onSubmit.bind(this) }/>,

                    <Button label="Delete Person"
                        onClick={ this.onDeleteClick.bind(this) }
                        className="EditPersonPane-deleteButton"/>
                ];
            }
        }
        else {
            // TODO: Show error?
            return <h1>HELO</h1>;
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditPersonPane-saveButton"
                label="Save Changes"
                onClick={ this.onSubmit.bind(this) }/>
        );
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
