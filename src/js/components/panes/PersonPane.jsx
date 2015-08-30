import React from 'react/addons';
import { DragSource } from 'react-dnd';

import PaneBase from './PaneBase';
import PersonForm from '../forms/PersonForm';
import Avatar from '../misc/Avatar';

const personSource = {
    beginDrag(props) {
        return props.person;
    },

    endDrag(props, monitor, component) {
        const dropResult = monitor.getDropResult();
        if (!dropResult) {
            // This was not a successful drag
            return;
        }

        const person = monitor.getItem();
        const newAction = dropResult.newAction;
        const targetType = dropResult.targetType;

        if (dropResult.onAddParticipant) {
            dropResult.onAddParticipant(person);
        }

        if (targetType == 'contact' && dropResult.onSetContact) {
            dropResult.onSetContact(person);
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

// Create a draggable version of the Avatar component as
// a simple decorated sub-class of Avatar.
@DragSource('person', personSource, collect)
class DraggableAvatar extends Avatar {
    render() {
        return this.props.connectDragSource(super.render());
    }
}


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

        this.getActions('person').updatePerson(personId, values);
    }

    onDeleteClick(ev) {
        var personId = this.props.params[0];

        this.getActions('person').deletePerson(personId);
        this.closePane();
    }
}
