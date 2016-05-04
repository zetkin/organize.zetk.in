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

        // TODO: Execute query on server
    }

    renderPaneContent(data) {
        if (!data) {
            return null;
        }

        // TODO: Use result of server-side query
        const filteredPeople = [];

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
