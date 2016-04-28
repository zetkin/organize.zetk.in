import React from 'react';

import PaneBase from './PaneBase';
import { resolveFilterComponent } from '../filters';


export default class QueryPane extends PaneBase {
    getRenderData() {
        const queryStore = this.getStore('query');
        const query = queryStore.getQuery(this.getParam(0));

        return query || { filters: [] };
    }

    getPaneTitle(data) {
        return data.title? ('Edit query: ' + data.title) : 'Edit query';
    }

    componentDidMount() {
        this.listenTo('query', this.forceUpdate);
    }

    renderPaneContent(data) {
        const filters = data.filters;
        const filterElements = [];

        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];
            let FilterComponent = resolveFilterComponent(filter.type);

            filterElements.push(
                <FilterComponent key={ i } config={ filter.config }
                    onFilterRemove={ this.onFilterRemove.bind(this, i) }
                    onFilterChange={ this.onFilterChange.bind(this, i) }/>
            );
        }

        const filterTypes = {
            'campaign': 'Campaign participation',
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
        const filterType = ev.target.value;
        const queryId = this.getParam(0);

        this.getActions('query').addFilter(queryId, filterType);
    }

    onFilterChange(filterIndex, config) {
        const queryId = this.getParam(0);
        this.getActions('query').updateFilter(queryId, filterIndex, config);
    }

    onFilterRemove(filterIndex) {
        const queryId = this.getParam(0);
        this.getActions('query').removeFilter(queryId, filterIndex);
    }
}
