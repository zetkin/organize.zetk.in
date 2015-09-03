import React from 'react/addons';

import PaneBase from './PaneBase';
import PeopleList from '../misc/peoplelist/PeopleList';


export default class EditQueryPane extends PaneBase {
    getRenderData() {
        const queryStore = this.getStore('query');

        return queryStore.getQuery(this.getParam(0));
    }

    getPaneTitle(data) {
        return data.title;
    }

    getPaneSubTitle(data) {
        return (
            <a key="editLink" onClick={ this.onEditClick.bind(this) }>
                Edit this query</a>
        );
    }

    componentDidMount() {
        this.listenTo('person', this.forceUpdate);
        this.listenTo('query', this.forceUpdate);
    }

    renderPaneContent(data) {
        const personStore = this.getStore('person');
        const queryStore = this.getStore('query');
        const people = personStore.getPeople();

        const filteredPeople = queryStore.executeQuery(data.id, people);

        return [
            <PeopleList key="peopleList" people={ filteredPeople }
                onSelect={ this.onPersonSelect.bind(this) }/>
        ];
    }

    onPersonSelect(person) {
        this.gotoSubPane('person', person.id);
    }

    onEditClick(ev) {
        this.gotoSubPane('editquery', this.getParam(0));
    }
}
