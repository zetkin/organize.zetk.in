import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import TagCloud from '../misc/tagcloud/TagCloud';
import { retrievePersonTags } from '../../actions/personTag';
import { getListItemById } from '../../utils/store';
import { addToSelection, removeFromSelection, finishSelection }
    from '../../actions/selection';


@connect(state => state)
export default class SelectPersonTagsPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrievePersonTags());
    }

    getRenderData() {
        let selectionId = this.getParam(0);
        let selectionList = this.props.selections.selectionList;

        return {
            selectionItem: getListItemById(selectionList, selectionId),
            tagList: this.props.personTags.tagList,
        };
    }

    getPaneTitle(data) {
        return 'Select person tags';
    }

    renderPaneContent(data) {
        let selection = data.selectionItem.data;

        let tagsSelected = [];
        let tagsAvailable = [];

        if (data.tagList && !data.tagList.isPending) {
            tagsSelected = selection.selectedIds.map(id =>
                getListItemById(data.tagList, id).data);

            tagsAvailable = data.tagList.items.map(i => i.data).filter(d =>
                selection.selectedIds.indexOf(d.id) < 0);
        }

        let selectedHeader = 'Selected (' + tagsSelected.length + ')';

        return [
            <h3 key="selectedHeader">{ selectedHeader }</h3>,
            <TagCloud key="selectedTags" tags={ tagsSelected }
                showRemoveButtons={ true }
                onRemove={ this.onRemove.bind(this) }/>,
            <button key="saveButton" className="SelectPeoplePane-saveButton"
                onClick={ this.onClickSave.bind(this) }>Save</button>,
            <h3 key="availableHeader">Select tags to be added</h3>,
            <button key="createLink" className="SelectPeoplePane-createButton"
                onClick={ this.onClickCreate.bind(this) }>
                Create a new tag</button>,
            <TagCloud key="availableTags" tags={ tagsAvailable }
                showEditButtons={ true }
                onEdit={ this.onEdit.bind(this) }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    onClickSave() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }

    onClickCreate() {
        this.openPane('addpersontag');
    }

    onEdit(tag) {
        this.openPane('editpersontag', tag.id);
    }

    onSelect(tag) {
        let selectionId = this.getParam(0);
        this.props.dispatch(addToSelection(selectionId, tag.id));
    }

    onRemove(tag) {
        let selectionId = this.getParam(0);
        this.props.dispatch(removeFromSelection(selectionId, tag.id));
    }
}
