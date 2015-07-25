import { Store } from 'flummox';


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
        var i;
        var updated = false;
        var people = this.state.people;
        var person = res.data.data;

        for (i = 0; i < people.length; i++) {
            if (people[i].id == person.id) {
                people[i] = person;
                updated = true;
                break;
            }
        }

        if (!updated) {
            people.push(person);
        }

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
