import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import PersonList from '../lists/PersonList';
import { getListItemById } from '../../utils/store';
import { retrievePeople } from '../../actions/person';
import {
    addToSelection,
    finishSelection,
    removeFromSelection
} from '../../actions/selection';


@connect(state => state)
export default class SelectPeoplePane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrievePeople());
    }

    getRenderData() {
        let selectionId = this.getParam(0);
        let selectionList = this.props.selections.selectionList;

        return {
            selectionItem: getListItemById(selectionList, selectionId),
            personList: this.props.people.personList,
        };
    }

    getPaneTitle(data) {
        return 'Select people';
    }

    renderPaneContent(data) {
        let selection = data.selectionItem.data;

        let instructions = null;
        if (selection.instructions) {
            instructions = <p key="instructions">
                { selection.instructions }</p>;
        }

        // Create list of selected person objects from selection array
        // of selected IDs.
        let selectionList = {
            items: selection.selectedIds.map(id =>
                getListItemById(data.personList, id))
        }

        // Only show people that haven't already been selected
        let personList = Object.assign({}, data.personList, {
            items: data.personList.items.filter(p =>
                selection.selectedIds.indexOf(p.data.id) < 0)
        });

        let selectedHeader = 'Selected (' + selectionList.items.length + ')';

        // TODO: Use something more compact than PersonList?
        return [
            instructions,
            <h3 key="selectedHeader">{ selectedHeader }</h3>,
            <PersonList key="selectionList" personList={ selectionList }
                onSelect={ this.onDeselect.bind(this) }/>,
            <h3 key="availableHeader">Add people to selection</h3>,
            <PersonList key="availableList" personList={ personList }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        let label;
        let numSelected = data.selectionItem.data.selectedIds.length;

        // TODO: Move to l10n
        if (numSelected === 0) {
            label = 'Select no one';
        }
        else if (numSelected === 1) {
            label = 'Select one person';
        }
        else {
            label = 'Select ' + numSelected + ' people';
        }

        return (
            <Button className="SelectPeoplePane-saveButton"
                label={ label }
                onClick={ this.onClickSave.bind(this) }/>
        );
    }

    onClickSave() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }

    onSelect(personItem) {
        let personId = personItem.data.id;
        let selectionId = this.getParam(0);
        this.props.dispatch(addToSelection(selectionId, personId));
    }

    onDeselect(personItem) {
        let personId = personItem.data.id;
        let selectionId = this.getParam(0);
        this.props.dispatch(removeFromSelection(selectionId, personId));
    }
}
