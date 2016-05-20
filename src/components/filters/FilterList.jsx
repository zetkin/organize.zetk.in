import React from 'react';

import FilterListItem from './FilterListItem';


export default class FilterList extends React.Component {
    static propTypes = {
        filters: React.PropTypes.array.isRequired,
        onAppendFilter: React.PropTypes.func,
        onRemoveFilter: React.PropTypes.func,
        onChangeFilter: React.PropTypes.func,
    };

    render() {
        let filters = this.props.filters;
        let filterElements = [];

        const filterTypes = {
            'campaign_participation': 'Campaign participation',
            'join_date': 'Join date',
            'person_data': 'Person data'
        };

        return (
            <div className="FilterList">
                <ul className="FilterList-items">
                { filters.map((filter, idx) => {
                    let key = idx.toString() + '-' + JSON.stringify(filter);
                    return <FilterListItem key={ key } filter={ filter }
                        onChangeConfig={ this.onFilterChange.bind(this, idx) }
                        onRemove={ this.onFilterRemove.bind(this, idx) }/>
                }) }
                </ul>

                <div className="FilterList-pseudoFilter">
                    <select value=""
                        onChange={ this.onFilterTypeSelect.bind(this) }>
                        <option value="">Add filter</option>
                        {Object.keys(filterTypes).map(function(type) {
                            const label = filterTypes[type];
                            return <option value={ type }>{ label }</option>;
                        })}
                    </select>
                </div>
            </div>
        );
    }

    onFilterTypeSelect(ev) {
        let filterType = ev.target.value;
        if (this.props.onAppendFilter) {
            this.props.onAppendFilter(filterType);
        }
    }

    onFilterChange(filterIndex, config) {
        if (this.props.onChangeFilter) {
            this.props.onChangeFilter(filterIndex, config);
        }
    }

    onFilterRemove(filterIndex) {
        if (this.props.onRemoveFilter) {
            this.props.onRemoveFilter(filterIndex);
        }
    }
}
