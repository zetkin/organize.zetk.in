import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import Button from '../misc/Button';
import PeopleList from '../misc/peoplelist/PeopleList';
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
        let peopleSelected = selection.selectedIds.map(id =>
            getListItemById(data.personList, id));

        // Only show people that haven't already been selected
        let peopleAvailable = data.personList.items.filter(p =>
            selection.selectedIds.indexOf(p.data.id) < 0);

        let selectedHeader = 'Selected (' + peopleSelected.length + ')';

        // TODO: Use something more compact than PeopleList?
        return [
            instructions,
            <h3 key="selectedHeader">{ selectedHeader }</h3>,
            <PeopleList key="selectedList" people={ peopleSelected }
                onSelect={ this.onDeselect.bind(this) }/>,
            <h3 key="availableHeader">Add people to selection</h3>,
            <PeopleList key="availableList" people={ peopleAvailable }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="SelectPeoplePane-saveButton"
                label="Add Callers"
                onClick={ this.onClickSave.bind(this) }/>
        );
    }

    onClickSave() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }

    onSelect(person) {
        let selectionId = this.getParam(0);
        this.props.dispatch(addToSelection(selectionId, person.id));
    }

    onDeselect(person) {
        let selectionId = this.getParam(0);
        this.props.dispatch(removeFromSelection(selectionId, person.id));
    }
}
