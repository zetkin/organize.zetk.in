import React from 'react/addons';

import PaneBase from './PaneBase';
import { resolveFilterComponent } from '../filters';


export default class QueryPane extends PaneBase {
    getRenderData() {
        const queryStore = this.getStore('query');

        return queryStore.getQuery(this.getParam(0));
    }

    getPaneTitle(data) {
        return data.title;
    }

    renderPaneContent(data) {
        const filters = data.filters;
        const filterElements = [];

        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];
            let FilterComponent = resolveFilterComponent(filter.type);

            filterElements.push(
                <FilterComponent config={ filter.config }
                    onFilterChange={ this.onFilterChange.bind(this, i) }/>
            );
        }

        return (
            <div className="filters">
                { filterElements }
            </div>
        );
    }

    onFilterChange(filterIndex, config) {
        const queryId = this.getParam(0);
        this.getActions('query').updateFilter(queryId, filterIndex, config);
    }
}
