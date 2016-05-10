import React from 'react';

import PaneBase from './PaneBase';
import PeopleList from '../misc/peoplelist/PeopleList';


export default class QueryPane extends PaneBase {
    getRenderData() {
        let queryList = this.props.queries.queryList;
        let queryId = this.getParam(0);

        return {
            queryItem: getListItemById(queryList, queryId)
        };
    }

    getPaneTitle(data) {
        return data.queryItem? data.queryItem.data.title : '';
    }

    getPaneSubTitle(data) {
        return (
            <a key="editLink" onClick={ this.onEditClick.bind(this) }>
                Edit this query</a>
        );
    }

    renderPaneContent(data) {
        if (!data.queryItem) {
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
