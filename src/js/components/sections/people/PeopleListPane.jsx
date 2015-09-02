import React from 'react/addons';

import PaneBase from '../../panes/PaneBase';
import PeopleList from '../../misc/peoplelist/PeopleList';


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
            <select key="querySelect" value={ queryId }
                onChange={ this.onQueryChange.bind(this) }>
                <option value="">----</option>
                {queries.map(function(query) {
                    return (
                        <option key={ query.id } value={ query.id }>
                            { query.title }
                        </option>
                    );
                })}
            </select>,
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

    onQueryChange(ev) {
        this.setState({
            selectedQueryId: ev.target.value
        });
    }
}
