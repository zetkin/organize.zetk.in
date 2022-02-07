import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import TagCloud from '../misc/clouds/TagCloud';
import { retrieveLocationTags } from '../../actions/locationTag';
import { getListItemById } from '../../utils/store';
import { addToSelection, removeFromSelection, finishSelection }
    from '../../actions/selection';


@connect(state => state)
@injectIntl
export default class SelectLocationTagsPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveLocationTags());
    }

    getRenderData() {
        let selectionId = this.getParam(0);
        let selectionList = this.props.selections.selectionList;

        return {
            selectionItem: getListItemById(selectionList, selectionId),
            tagList: this.props.locationTags.tagList,
        };
    }

    getPaneTitle(data) {
        return this.props.intl
            .formatMessage({ id: 'panes.selectLocationTags.title' });
    }

    renderPaneContent(data) {
        let selection = data.selectionItem.data;

        let tagsSelected = [];
        let tagsAvailable = [];

        if (data.tagList && !data.tagList.isPending) {
            tagsSelected = selection.selectedIds.map(id =>
                getListItemById(data.tagList, id).data);

            tagsAvailable = data.tagList.items
                .map(i => i.data)
                .filter(d => selection.selectedIds.indexOf(d.id) < 0)
                .sort((t0, t1) => t0.title.localeCompare(t1.title));
        }

        let numSelected = tagsSelected.length;

        return [
            <Msg tagName="h3" key="selectedHeader"
                id="panes.selectLocationTags.selectedHeader"
                values={{ numSelected }}/>,
            <TagCloud key="selectedTags" tags={ tagsSelected }
                showRemoveButtons={ true }
                onRemove={ this.onRemove.bind(this) }/>,
            <Msg tagName="h3" key="availableHeader"
                id="panes.selectLocationTags.availableHeader"
                values={{ numSelected }}/>,
            <Button key="createButton"
                className="SelectLocationTagsPane-createButton"
                labelMsg="panes.selectLocationTags.createButton"
                onClick={ this.onClickCreate.bind(this) }/>,
            <TagCloud key="availableTags" tags={ tagsAvailable }
                showEditButtons={ true }
                onEdit={ this.onEdit.bind(this) }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        let numSelected = data.selectionItem.data.selectedIds.length;

        return (
            <Button className="SelectLocationTagsPane-saveButton"
                labelMsg="panes.selectLocationTags.saveButton"
                labelValues={{ numSelected }}
                onClick={ this.onClickSave.bind(this) }/>
        );
    }

    onClickSave() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }

    onClickCreate() {
        this.openPane('addlocationtag');
    }

    onEdit(tag) {
        this.openPane('editlocationtag', tag.id);
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
