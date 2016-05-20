import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import QueryForm from '../forms/QueryForm';
import FilterList from '../filters/FilterList';
import { getListItemById } from '../../utils/store';
import {
    addQueryFilter,
    updateQuery,
    updateQueryFilter,
    removeQueryFilter,
    retrieveQuery,
} from '../../actions/query';


@connect(state => state)
export default class EditQueryPane extends PaneBase {
    componentDidMount() {
        let queryId = this.getParam(0);
        this.props.dispatch(retrieveQuery(queryId));
    }

    getRenderData() {
        let queryList = this.props.queries.queryList;
        let queryId = this.getParam(0);

        return {
            queryItem: getListItemById(queryList, queryId)
        };
    }

    getPaneTitle(data) {
        return data.queryItem?
            ('Edit query: ' + data.queryItem.data.title) : 'Edit query';
    }

    renderPaneContent(data) {
        if (data.queryItem && !data.queryItem.isPending) {
            let query = data.queryItem.data;
            let filters = query.filter_spec;

            return [
                <QueryForm key="form" ref="form" query={ query }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <h3 key="filterHeader">Filters</h3>,
                <FilterList key="filters" filters={ filters }
                    onAppendFilter={ this.onAppendFilter.bind(this) }
                    onRemoveFilter={ this.onRemoveFilter.bind(this) }
                    onChangeFilter={ this.onChangeFilter.bind(this) }/>
            ];
        }
        else {
            // TODO: Show loading indicator
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <button onClick={ this.onSubmit.bind(this) }>
                Submit</button>
        );
    }

    onAppendFilter(type) {
        let queryId = this.getParam(0);
        this.props.dispatch(addQueryFilter(queryId, type));
    }

    onChangeFilter(filterIndex, config) {
        let queryId = this.getParam(0);
        this.props.dispatch(updateQueryFilter(queryId, filterIndex, config));
    }

    onRemoveFilter(filterIndex) {
        let queryId = this.getParam(0);
        this.props.dispatch(removeQueryFilter(queryId, filterIndex));
    }

    onSubmit(ev) {
        ev.preventDefault();

        let queryId = this.getParam(0);
        let values = this.refs.form.getValues();

        // TODO: Include filter spec

        this.props.dispatch(updateQuery(queryId, values));
    }
}
