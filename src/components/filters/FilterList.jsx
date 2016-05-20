import cx from 'classnames';
import React from 'react';
import { DropTarget } from 'react-dnd';

import FilterListItem from './FilterListItem';
import DropContainer from '../misc/DropContainer';
import makeRandomString from '../../utils/makeRandomString';


const filterTarget = {
    canDrop(props, monitor) {
        // A filter can never be dropped onto the list. It must be dropped
        // onto one of the DropContainers that are added between list items
        // while isDraggingOver.
        return false;
    }
}


function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDraggingOver: monitor.isOver(),
    };
}

@DropTarget('filter', filterTarget, collectTarget)
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

        let items = [];
        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];

            items.push(
                <FilterListItem key={ filter.id } filter={ filter }
                    showOpSwitch={ i > 0 && !this.props.isDraggingOver }
                    onChangeConfig={ this.onChangeConfig.bind(this, i) }
                    onChangeOp={ this.onChangeOp.bind(this, i) }
                    onRemove={ this.onFilterRemove.bind(this, i) }/>
            );

            if (this.props.isDraggingOver) {
                let key = 'dropAfter-' + filter.id;
                items.push(
                    <li key={ key }>
                        <DropContainer type="filter"
                            instructions="Drop here to move filter"
                            onDrop={ this.onDrop.bind(this, i+1) }/>
                    </li>
                );
            }
        }

        let addSection = null;
        if (!this.props.isDraggingOver) {
            addSection = (
                <div className="FilterList-addSection">
                    <select value=""
                        onChange={ this.onFilterTypeSelect.bind(this) }>
                        <option value="">Add filter</option>
                        {Object.keys(filterTypes).map(function(type) {
                            const label = filterTypes[type];
                            return <option value={ type }>{ label }</option>;
                        })}
                    </select>
                </div>
            );
        }

        let classes = cx('FilterList', {
            'FilterList-isDraggingOver': this.props.isDraggingOver,
        });

        return this.props.connectDropTarget(
            <div className={ classes }>
                <ul className="FilterList-items">
                    { items }
                </ul>
                { addSection }
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

    onDrop(targetIdx, item) {
        let filters = this.state.filters.concat();
        let filter = filters.find(f => f.id == item.id);
        let idx = filters.indexOf(filter);

        // Remove old filter
        filters.splice(idx, 1);

        // If the new position is later in the array, it will now have
        // been moved back by one, since an earlier filter was removed
        if (targetIdx > idx) targetIdx--;

        // Insert into it's new position
        filters.splice(targetIdx, 0, item);

        this.setState({ filters });
    }
}
