import { connect } from 'react-redux';
import React from 'react';

import PaneBase from '../../panes/PaneBase';
import PeopleList from '../../misc/peoplelist/PeopleList';
import RelSelectInput from '../../forms/inputs/RelSelectInput';
import { retrievePeople } from '../../../actions/person';
import { getListItemById } from '../../../utils/store';
import {
    createQuery,
    retrieveQueries,
    retrieveQueryMatches,
} from '../../../actions/query';


@connect(state => ({ people: state.people, queries: state.queries }))
export default class PeopleListPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueryId: undefined
        };
    }

    getPaneTitle() {
        return 'People';
    }

    componentDidMount() {
        super.componentDidMount();

        // TODO: Do this only if data is old or does not exist
        this.props.dispatch(retrievePeople());
        this.props.dispatch(retrieveQueries());
    }

    renderPaneContent() {
        let people = this.props.people.personList.items;

        if (this.state.selectedQueryId) {
            let queryId = this.state.selectedQueryId;
            let queryList = this.props.queries.queryList;
            let query = getListItemById(queryList, queryId);

            if (query && query.data && query.data.matchList) {
                people = query.data.matchList.items;
            }
        }

        return (
            <PeopleList key="personList" people={ people }
                onSelect={ this.onSelect.bind(this) }/>
        );
    }

    getPaneTools(data) {
        let queryId = this.state.selectedQueryId;
        let queryList = this.props.queries.queryList;
        let query = getListItemById(queryList, queryId);

        // Only include queries that have a title
        // TODO: Find some better way to filter out call assignment queries,
        //       e.g. a proper type attribute on the query
        let queries = queryList.items.map(i => i.data).filter(q => q.title);

        return [
            <RelSelectInput key="querySelect" name="querySelect"
                value={ queryId } objects={ queries } showEditLink={ true }
                allowNull={ true } nullLabel="(Show all people)"
                onValueChange={ this.onQueryChange.bind(this) }
                onCreate={ this.onQueryCreate.bind(this) }
                onEdit={ this.onQueryEdit.bind(this) }/>,
            <button key="addButton" className="PeopleListPane-addButton"
                onClick={ this.onAddClick.bind(this) }>Add</button>
        ];
    }

    onSelect(person) {
        this.openPane('person', person.id);
    }

    onAddClick(person) {
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
