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
            <input key="addButton" type="button" value="Add"
                onClick={ this.onAddClick.bind(this) }/>,
            <RelSelectInput name="querySelect" value={ queryId }
                objects={ queries } showEditLink={ true }
                onValueChange={ this.onQueryChange.bind(this) }
                onCreate={ this.onQueryCreate.bind(this) }
                onEdit={ this.onQueryEdit.bind(this) }/>,
            <PeopleList key="peopleList" people={ people }
                onSelect={ this.onSelect.bind(this) }/>
        ];
    }

    onSelect(person) {
        this.gotoSubPane('person', person.id);
    }

    onAddClick(person) {
        this.gotoSubPane('addperson');
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
        this.gotoSubPane('editquery', queries[queries.length-1].id);
    }

    onQueryEdit(query) {
        this.gotoSubPane('editquery', query.id);
    }
}
