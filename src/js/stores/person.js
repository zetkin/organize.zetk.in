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
    }

    getPeople() {
        return this.state.people;
    }

    onGetPeopleComplete(res) {
        this.setState({
            people: res.data.data
        });
    }
}
