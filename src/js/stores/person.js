import { Store } from 'flummox';

import StoreUtils from '../utils/StoreUtils';


export default class PersonStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            people: []
        });

        var personActions = flux.getActions('person');
        this.register(personActions.retrievePeople,
            this.onRetrievePeopleComplete);
        this.register(personActions.retrievePerson,
            this.onRetrievePersonComplete);
    }

    getPeople() {
        return this.state.people;
    }

    getPerson(id) {
        return this.state.people.find(p => p.id == id);
    }

    onRetrievePeopleComplete(res) {
        this.setState({
            people: res.data.data
        });
    }

    onRetrievePersonComplete(res) {
        var people = this.state.people;
        var person = res.data.data;

        StoreUtils.updateOrAdd(people, person.id, person);

        this.setState({
            people: people
        });
    }

    static serialize(state) {
        return JSON.stringify(state)
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
