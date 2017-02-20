import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import PersonList from '../lists/PersonList';
import { getListItemById } from '../../utils/store';
import { retrieveQuery, retrieveQueryMatches } from '../../actions/query';


@connect(state => ({ queries: state.queries }))
export default class QueryPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let queryId = this.getParam(0);
        this.props.dispatch(retrieveQuery(queryId));
        this.props.dispatch(retrieveQueryMatches(queryId));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.queries != nextProps.queries) {
            let queryId = this.getParam(0);
            let queryList = this.props.queries.queryList;
            let queryItem = getListItemById(queryList, queryId);

            // Load query matches if not already loaded (or loading)
            if (queryItem && queryItem.data && !queryItem.data.matchList) {
                this.props.dispatch(retrieveQueryMatches(queryId));
            }
        }
    }

    getRenderData() {
        let queryId = this.getParam(0);
        let queryList = this.props.queries.queryList;

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
        let item = data.queryItem;
        if (item && item.data && item.data.matchList) {
            let matchList = item.data.matchList;

            return [
                <PersonList key="peopleList" personList={ matchList }
                    onItemClick={ this.onPersonItemClick.bind(this) }/>
            ];
        }
    }

    onPersonItemClick(personItem, ev) {
        if (ev && ev.altKey) {
            this.openPane('editperson', personItem.data.id);
        }
        else {
            this.openPane('person', personItem.data.id);
        }
    }

    onEditClick(ev) {
        this.openPane('editquery', this.getParam(0));
    }
}
