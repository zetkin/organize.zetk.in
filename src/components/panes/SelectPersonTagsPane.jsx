import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import TagCloud from '../misc/tagcloud/TagCloud';
import TextInput from '../forms/inputs/TextInput';
import { retrievePersonTags } from '../../actions/personTag';
import { getListItemById } from '../../utils/store';
import { addToSelection, removeFromSelection, finishSelection }
    from '../../actions/selection';


@connect(state => state)
@injectIntl
export default class SelectPersonTagsPane extends PaneBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            tagsFilter: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();

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
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.selectPersonTags.title' });
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
                .filter(t => {
                    const filter = this.state.tagsFilter.toLowerCase();
                    const tagTitle = t.title.toLowerCase();

                    return tagTitle.includes(filter);
                })
                .sort((t0, t1) => t0.title.localeCompare(t1.title));
        }

        let numSelected = tagsSelected.length;

        return [
            <Msg tagName="h3" key="selectedHeader"
                id="panes.selectPersonTags.selectedHeader"
                values={{ numSelected }}/>,
            <TagCloud key="selectedTags" tags={ tagsSelected }
                showRemoveButtons={ true }
                onRemove={ this.onRemove.bind(this) }/>,
            <Msg tagName="h3" key="availableHeader"
                id="panes.selectPersonTags.availableHeader"
                values={{ numSelected }}/>,
            <Button key="createLink"
                labelMsg="panes.selectPersonTags.createButton"
                className="SelectPeoplePane-createButton"
                onClick={ this.onClickCreate.bind(this) }/>,
            <TextInput key="tagsFilter" name="tagsFilter"
                className="SelectPersonTagsPane-tagsFilter"
                labelMsg="panes.selectPersonTags.tagsFilter"
                value={ this.state.tagsFilter }
                onValueChange={ this.onChangeTagsFilter.bind(this) }/>,
            <TagCloud key="availableTags" tags={ tagsAvailable }
                showEditButtons={ true }
                onEdit={ this.onEdit.bind(this) }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        let numSelected = data.selectionItem.data.selectedIds.length;

        return (
            <Button className="SelectPersonTagsPane-saveButton"
                labelMsg="panes.selectPersonTags.okButton"
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

    onChangeTagsFilter(name, value) {
        this.setState({ ...this.state, tagsFilter: value});
    }
}
