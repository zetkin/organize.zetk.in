import { Store } from 'flummox';


export default class PersonStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            people: []
        });

        var personActions = flux.getActions('person');
        this.register(personActions.getPeople,
            this.onGetPeopleComplete);
        this.register(personActions.getPerson,
            this.onGetPersonComplete);
    }

    getPeople() {
        return this.state.people;
    }

    getPerson(id) {
        return this.state.people.find(p => p.id == id);
    }

    onGetPeopleComplete(res) {
        this.setState({
            people: res.data.data
        });
    }

    onGetPersonComplete(res) {
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
}
