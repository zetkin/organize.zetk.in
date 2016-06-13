import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import QueryForm from '../forms/QueryForm';
import Button from '../misc/Button';
import FilterList from '../filters/FilterList';
import { getListItemById } from '../../utils/store';
import {
    addQueryFilter,
    updateQuery,
    updateQueryFilter,
    removeQueryFilter,
    retrieveQuery,
} from '../../actions/query';


@connect(state => ({ queries: state.queries }))
export default class EditQueryPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

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
                <FilterList ref="filters" key="filters" filters={ filters }
                    openPane={ this.openPane.bind(this) }/>, // TODO: Remove eventually
            ];
        }
        else {
            // TODO: Show loading indicator
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button label="Save Query"
                onClick={ this.onSubmit.bind(this) }
                className="EditQueryPane-saveButton"/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let queryId = this.getParam(0);
        let values = this.refs.form.getValues();
        let listComponent = this.refs.filters.decoratedComponentInstance;

        values = Object.assign({}, values, {
            filter_spec: listComponent.getFilterSpec(),
        });

        this.props.dispatch(updateQuery(queryId, values));
    }
}
