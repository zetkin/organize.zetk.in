import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { resolveFilterComponent } from '../filters';
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
        const filters = data.queryItem? data.queryItem.data.filter_spec : [];
        const filterElements = [];

        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];
            let FilterComponent = resolveFilterComponent(filter.type);
            let key = i.toString() + '-' + JSON.stringify(filter);

            filterElements.push(
                <FilterComponent key={ key } config={ filter }
                    onFilterRemove={ this.onFilterRemove.bind(this, i) }
                    onFilterChange={ this.onFilterChange.bind(this, i) }/>
            );
        }

        const filterTypes = {
            'campaign_participation': 'Campaign participation',
            'join_date': 'Join date',
            'person_data': 'Person data'
        };

        return [
            <div className="EditQueryPane-filters">
                { filterElements }
            </div>,
            <div className="EditQueryPane-pseudoFilter">
                <select key="filterTypeSelect" value=""
                    onChange={ this.onFilterTypeSelect.bind(this) }>
                    <option value="">Add filter</option>
                    {Object.keys(filterTypes).map(function(type) {
                        const label = filterTypes[type];
                        return <option value={ type }>{ label }</option>;
                    })}
                </select>
            </div>
        ];
    }

    onFilterTypeSelect(ev) {
        let filterType = ev.target.value;
        let queryId = this.getParam(0);
        this.props.dispatch(addQueryFilter(queryId, filterType));
    }

    onFilterChange(filterIndex, config) {
        let queryId = this.getParam(0);
        this.props.dispatch(updateQueryFilter(queryId, filterIndex, config));
    }

    onFilterRemove(filterIndex) {
        let queryId = this.getParam(0);
        this.props.dispatch(removeQueryFilter(queryId, filterIndex));
    }
}
