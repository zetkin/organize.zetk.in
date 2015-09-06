import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import PeopleList from '../../misc/peoplelist/PeopleList';
import RelSelectInput from '../../forms/inputs/RelSelectInput';


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
        this.listenTo('query', this.forceUpdate);
        this.listenTo('person', this.forceUpdate);
        this.getActions('person').retrievePeople();
    }

    renderPaneContent() {
        var personStore = this.getStore('person');
        var people = personStore.getPeople();

        const queryId = this.state.selectedQueryId;
        const queryStore = this.getStore('query');
        const queries = queryStore.getQueries();

        if (queryId) {
            people = queryStore.executeQuery(queryId, people);
        }

        return [
            <button key="addButton" className="add-person"
            onClick={ this.onAddClick.bind(this) }>Add</button>,
            <RelSelectInput name="querySelect" value={ queryId }
                objects={ queries } showEditLink={ true }
                allowNull={ true } nullLabel="(Show all people)"
                onValueChange={ this.onQueryChange.bind(this) }
                onCreate={ this.onQueryCreate.bind(this) }
                onEdit={ this.onQueryEdit.bind(this) }/>,
            <PeopleList key="peopleList" people={ people }
                onSelect={ this.onSelect.bind(this) }/>
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
