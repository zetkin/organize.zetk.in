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
        let personId = this.getParam(0);
        let person = getListItemById(this.props.people.personList, personId);

        if (!person) {
            this.props.dispatch(retrievePerson(personId));
        }
    }

    getRenderData() {
        let personId = this.getParam(0);

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
                    <PersonForm key="form" ref="personForm"
                        person={ data.personItem.data }
                        onSubmit={ this.onSubmit.bind(this) }/>,

                    <Button key="deleteButton"
                        labelMsg="panes.editPerson.deleteButton"
                        onClick={ this.onDeleteClick.bind(this) }
                        className="EditPersonPane-deleteButton"/>
                ];
            }
        }
        else {
            // TODO: Show error?
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditPersonPane-saveButton"
                labelMsg="panes.editPerson.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let form = this.refs.personForm;
        let values = form.getChangedValues();
        let personId = this.getParam(0);

        this.props.dispatch(updatePerson(personId, values));
    }

    onDeleteClick(ev) {
        var personId = this.getParam(0);

        this.props.dispatch(deletePerson(personId));
        this.closePane();
    }
}
