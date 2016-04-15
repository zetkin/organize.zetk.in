import React from 'react';

import PaneBase from './PaneBase';
import PeopleList from '../misc/peoplelist/PeopleList';


export default class QueryPane extends PaneBase {
    getRenderData() {
        const queryStore = this.getStore('query');

        return queryStore.getQuery(this.getParam(0));
    }

    getPaneTitle(data) {
        return data? data.title : '';
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

        // TODO: Replace with actually executing query
        this.getActions('person').retrievePeople();
    }

    renderPaneContent(data) {
        if (!data) {
            return null;
        }

        const personStore = this.getStore('person');
        const queryStore = this.getStore('query');
        const people = personStore.getPeople();

        // TODO: Should happen server-side
        const filteredPeople = queryStore.executeQuery(data.id, people);

        return [
            <PeopleList key="peopleList" people={ filteredPeople }
                onSelect={ this.onPersonSelect.bind(this) }/>
        ];
    }

    onPersonSelect(person) {
        this.openPane('person', person.id);
    }

    onEditClick(ev) {
        this.openPane('editquery', this.getParam(0));
    }
}
