import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
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
@injectIntl
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
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.selectPeople.title' });
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

        let numSelected = selectionList.items.length;

        // TODO: Use something more compact than PersonList?
        return [
            instructions,
            <Msg tagName="h3" key="selectedHeader"
                id="panes.selectPeople.selectedHeader"
                values={{ numSelected }}/>,
            <PersonList key="selectionList" personList={ selectionList }
                onItemClick={ this.onDeselect.bind(this) }/>,
            <Msg tagName="h3" key="availableHeader"
                id="panes.selectPeople.availableHeader"/>,
            <PersonList key="availableList" personList={ personList }
                onItemClick={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        let numSelected = data.selectionItem.data.selectedIds.length;

        return (
            <Button className="SelectPeoplePane-saveButton"
                labelMsg="panes.selectPeople.okButton"
                labelValues={{ numSelected }}
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
