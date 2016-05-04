import { connect } from 'react-redux';
import React from 'react';

import { retrievePeople } from '../../../actions/person';

import PaneBase from '../../panes/PaneBase';
import PeopleList from '../../misc/peoplelist/PeopleList';
import RelSelectInput from '../../forms/inputs/RelSelectInput';


@connect(state => state)
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
    }

    renderPaneContent() {
        // TODO: Handle queries correctly
        let people = this.props.people.personList.items;

        return (
            <PeopleList key="personList" people={ people }
                onSelect={ this.onSelect.bind(this) }/>
        );
    }

    getPaneTools(data) {
        const queryId = this.state.selectedQueryId;
        const queryStore = this.getStore('query');
        const queries = queryStore.getQueries();

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
        this.setState({
            selectedQueryId: value
        });
    }

    onQueryCreate(title) {
        // TODO: Is this the best way?
        this.getActions('query').createQuery(title);

        const queries = this.getStore('query').getQueries();
        this.openPane('editquery', queries[queries.length-1].id);
    }

    onQueryEdit(query) {
        this.openPane('editquery', query.id);
    }
}
