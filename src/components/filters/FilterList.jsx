import React from 'react';

import FilterListItem from './FilterListItem';
import makeRandomString from '../../utils/makeRandomString';


export default class FilterList extends React.Component {
    static propTypes = {
        filters: React.PropTypes.array.isRequired,
        onAppendFilter: React.PropTypes.func,
        onRemoveFilter: React.PropTypes.func,
        onChangeFilter: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            filters: props.filters.map(f => Object.assign({}, f, {
                id: makeRandomString(10),
            })),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filters != this.props.filters) {
            this.setState({
                filters: nextProps.filters.map(f => Object.assign({}, f, {
                    id: makeRandomString(10),
                })),
            });
        }
    }

    render() {
        let filters = this.state.filters;
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
                    return <FilterListItem key={ filter.id } filter={ filter }
                        showOpSwitch={ idx > 0 }
                        onChangeConfig={ this.onChangeConfig.bind(this, idx) }
                        onChangeOp={ this.onChangeOp.bind(this, idx) }
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

    getFilterSpec() {
        return this.state.filters;
    }

    onFilterTypeSelect(ev) {
        let filterType = ev.target.value;

        this.setState({
            filters: this.state.filters.concat([{
                op: 'add',
                id: makeRandomString(10),
                type: filterType,
                config: {},
            }]),
        })
    }

    onChangeConfig(filterIndex, config) {
        let filters = this.state.filters.concat();

        filters[filterIndex].config = config;
        this.setState({
            filters: filters,
        });
    }

    onChangeOp(filterIndex, op) {
        let filters = this.state.filters.concat();

        filters[filterIndex].op = op;
        this.setState({
            filters: filters,
        });
    }

    onFilterRemove(filterIndex) {
        let filters = this.state.filters;
        this.setState({
            filters: filters.filter((f, idx) => idx != filterIndex),
        });
    }
}
