import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import React from 'react';

import PaneBase from '../../panes/PaneBase';
import Button from '../../misc/Button';
import PersonList from '../../lists/PersonList';
import RelSelectInput from '../../forms/inputs/RelSelectInput';
import { retrievePeople } from '../../../actions/person';
import { getListItemById } from '../../../utils/store';
import {
    createQuery,
    retrieveQueries,
    retrieveQueryMatches,
} from '../../../actions/query';


@connect(state => ({ people: state.people, queries: state.queries }))
@injectIntl
export default class PeopleListPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueryId: undefined
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

    renderPaneContent() {
        let personList = this.props.people.personList;

        if (this.state.selectedQueryId) {
            let queryId = this.state.selectedQueryId;
            let queryList = this.props.queries.queryList;
            let query = getListItemById(queryList, queryId);

            if (query && query.data && query.data.matchList) {
                personList = query.data.matchList;
            }
        }

        return (
            <PersonList key="personList" personList={ personList }
                onSelect={ this.onSelect.bind(this) }/>
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

        return [
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
    }

    onSelect(item) {
        let person = item.data;
        this.openPane('person', person.id);
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
