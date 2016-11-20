import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import React from 'react';

import PaneBase from '../../panes/PaneBase';
import BulkOpSelect from '../../bulk/BulkOpSelect';
import Button from '../../misc/Button';
import PersonList from '../../lists/PersonList';
import RelSelectInput from '../../forms/inputs/RelSelectInput';
import { retrievePeople } from '../../../actions/person';
import { getListItemById } from '../../../utils/store';
import {
    createSelection,
    addToSelection,
    removeFromSelection,
} from '../../../actions/selection';
import {
    createQuery,
    retrieveQueries,
    retrieveQueryMatches,
} from '../../../actions/query';


const mapStateToProps = state => ({
    people: state.people,
    queries: state.queries,
    selections: state.selections,
});


@connect(mapStateToProps)
@injectIntl
export default class PeopleListPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueryId: undefined,
            bulkSelectionId: undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.queries != nextProps.queries) {
            let queryId = this.state.selectedQueryId;
            let queryList = this.props.queries.queryList;
            let queryItem = getListItemById(queryList, queryId);

            // Load query matches if not already loaded (or loading)
            if (queryItem && queryItem.data && !queryItem.data.matchList) {
                this.props.dispatch(retrieveQueryMatches(queryId));
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();

        // TODO: Do this only if data is old or does not exist
        this.props.dispatch(retrievePeople());
        this.props.dispatch(retrieveQueries());
    }

    getRenderData() {
        let selectionId = this.state.bulkSelectionId;
        let selectionList = this.props.selections.selectionList;
        let selectionItem = getListItemById(selectionList, selectionId);

        let personList = this.props.people.personList;

        if (this.state.selectedQueryId) {
            let queryId = this.state.selectedQueryId;
            let queryList = this.props.queries.queryList;
            let query = getListItemById(queryList, queryId);

            if (query && query.data && query.data.matchList) {
                personList = query.data.matchList;
            }
        }

        return {
            personList,
            selection: selectionItem? selectionItem.data : null,
        };
    }

    renderPaneContent(data) {
        let personList = data.personList
        let selection = data.selection;

        return (
            <PersonList key="personList" personList={ personList }
                allowBulkSelection={ true }
                bulkSelection={ selection }
                onLoadPage={ this.onLoadPage.bind(this) }
                onItemSelect={ this.onItemSelect.bind(this) }
                onItemClick={ this.onItemClick.bind(this) }/>
        );
    }

    getPaneTools(data) {
        const formatMessage = this.props.intl.formatMessage;

        let queryId = this.state.selectedQueryId;
        let queryList = this.props.queries.queryList;
        let query = getListItemById(queryList, queryId);

        // Only include queries that have a title
        // TODO: Find some better way to filter out call assignment queries,
        //       e.g. a proper type attribute on the query
        let queries = queryList.items.map(i => i.data).filter(q => q.title);

        let querySelectNullLabel = formatMessage(
            { id: 'panes.peopleList.querySelect.nullLabel' });

        let tools = [
            <RelSelectInput key="querySelect" name="querySelect"
                value={ queryId } objects={ queries } showEditLink={ true }
                allowNull={ true } nullLabel={ querySelectNullLabel }
                onValueChange={ this.onQueryChange.bind(this) }
                onCreate={ this.onQueryCreate.bind(this) }
                onEdit={ this.onQueryEdit.bind(this) }/>,
            <Button key="addButton"
                className="PeopleListPane-addButton"
                labelMsg="panes.peopleList.addButton"
                onClick={ this.onAddClick.bind(this) }/>
        ];

        if (data.selection && data.selection.selectedIds.length) {
            let ops = [ 'delete', 'tag', 'export' ];

            tools.push(
                <BulkOpSelect key="bulkOps"
                    objectType="person"
                    openPane={ this.openPane.bind(this) }
                    selection={ data.selection }
                    operations={ ops }/>
            );
        }

        return tools;
    }

    onItemClick(item) {
        let person = item.data;
        this.openPane('person', person.id);
    }

    onItemSelect(item, selected) {
        let selectionId = this.state.bulkSelectionId;
        if (!selectionId) {
            let action = createSelection('bulk', null, null);
            selectionId = action.payload.id;

            this.props.dispatch(action);
            this.setState({
                bulkSelectionId: selectionId
            });
        }

        if (selected) {
            this.props.dispatch(addToSelection(selectionId, item.data.id));
        }
        else {
            this.props.dispatch(removeFromSelection(selectionId, item.data.id));
        }
    }

    onLoadPage(page) {
        if (this.state.selectedQueryId) {
            // TODO: Load paginated query matches once supported
        }
        else {
            this.props.dispatch(retrievePeople(page));
        }
    }

    onAddClick() {
        this.openPane('addperson');
    }

    onQueryChange(name, value) {
        if (value) {
            this.props.dispatch(retrieveQueryMatches(value));
        }

        this.setState({
            selectedQueryId: value
        });
    }

    onQueryCreate(title) {
        this.props.dispatch(createQuery(title));
        // TODO: Open pane with new query
    }

    onQueryEdit(query) {
        this.openPane('editquery', query.id);
    }
}
