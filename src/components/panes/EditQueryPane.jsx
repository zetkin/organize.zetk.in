import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import FilterList from '../filters/FilterList';
import { getListItemById } from '../../utils/store';
import { addQueryFilter, updateQueryFilter, removeQueryFilter
    } from '../../actions/query';


@connect(state => state)
export default class QueryPane extends PaneBase {
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
            const filters = data.queryItem? data.queryItem.data.filter_spec : [];

            return [
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
}
