import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import Button from '../misc/Button';
import DraggableAvatar from '../misc/DraggableAvatar';
import LoadingIndicator from '../misc/LoadingIndicator';
import { retrieveFieldTypesForOrganization } from '../../actions/personField';
import { retrievePerson, updatePerson }
    from '../../actions/person';
import { getListItemById } from '../../utils/store';


const mapStateToProps = (state, props) => ({
    fieldTypes: state.personFields.fieldTypes,
    personItem: getListItemById(
                    state.people.personList,
                    props.paneData.params[0]),
    activeOrg: state.org.activeId,
});

@connect(mapStateToProps)
export default class EditPersonPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const personId = this.getParam(0);
        const person = this.props.personItem;

        if (!person) {
            this.props.dispatch(retrievePerson(personId));
        }

        if (!this.props.fieldTypes || !this.props.fieldTypes.items) {
            this.props.dispatch(retrieveFieldTypesForOrganization());
        }
    }

    getPaneTitle(data) {
        if (this.props.personItem) {
            const person = this.props.personItem.data;
            return person.first_name + ' ' + person.last_name;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (this.props.personItem) {
            if (this.props.personItem.isPending) {
                return <LoadingIndicator/>;
            }
            else {
                return [
                    <PersonForm key="form" ref="personForm"
                        fieldTypes={ this.props.fieldTypes }
                        person={ this.props.personItem.data }
                        onSubmit={ this.onSubmit.bind(this) }/>,

                    <Button key="removeButton"
                        labelMsg="panes.editPerson.removeButton"
                        onClick={ this.onRemoveClick.bind(this) }
                        className="EditPersonPane-removeButton"/>
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
        this.closePane();
    }

    onRemoveClick(ev) {
        const personId = this.getParam(0);
	// We want to remove membership from active org
	const connectionOrg = this.props.activeOrg;

        this.openPane('confirmdelete', personId, 'connection', connectionOrg);
        this.closePane();
    }
}
