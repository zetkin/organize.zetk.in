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


const mapStateToProps = (state, props) => ({
    selectionItem: getListItemById(
                        state.selections.selectionList,
                        props.paneData.params[0]),
    personList: state.people.personList,
});

@connect(mapStateToProps)
@injectIntl
export default class SelectPeoplePane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrievePeople());
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.selectPeople.title' });
    }

    renderPaneContent(data) {
        const { selectionItem, personList } = this.props;
        let selection = selectionItem.data;

        let instructions = null;
        if (selection.instructions) {
            instructions = <p key="instructions">
                { selection.instructions }</p>;
        }

        // Create list of selected person objects from selection array
        // of selected IDs.
        let selectionList = {
            items: selection.selectedIds.map(id =>
                getListItemById(personList, id))
        }

        // Only show people that haven't already been selected
        const filteredPersonList = Object.assign({}, personList, {
            items: personList.items.filter(p =>
                selection.selectedIds.indexOf(p.data.id) < 0)
        });

        const numSelected = selectionList.items.length;

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
            <PersonList key="availableList" personList={ filteredPersonList }
                enablePagination={ true }
                onItemClick={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        let numSelected = this.props.selectionItem.data.selectedIds.length;

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

    onLoadPage(page) {
        this.props.dispatch(retrievePeople(page));
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
