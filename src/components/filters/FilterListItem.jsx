import React from 'react';
import { DragSource } from 'react-dnd';

import FilterOpSwitch from './FilterOpSwitch';
import { resolveFilterComponent } from '.';

const filterSource = {
    beginDrag(props) {
        return props.filter;
    },
};

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}


@DragSource('filter', filterSource, collectSource)
export default class FilterListItem extends React.Component {
    static propTypes = {
        filter: React.PropTypes.shape({
            op: React.PropTypes.string,
            type: React.PropTypes.string.isRequired,
            config: React.PropTypes.object.isRequired,
        }).isRequired,
        showOpSwitch: React.PropTypes.bool,
        onRemove: React.PropTypes.func,
        onChangeConfig: React.PropTypes.func,
        onChangeOp: React.PropTypes.func,
    };

    static defaultProps = {
        showOpSwitch: true,
    };

    render() {
        let filterData = this.props.filter;

        let FilterComponent = resolveFilterComponent(filterData.type);
        let filter = this.props.connectDragSource(
            <div className="FilterListItem-filter">
                <FilterComponent config={ filterData.config }
                    onFilterRemove={ this.onRemove.bind(this) }
                    onConfigChange={ this.onChangeConfig.bind(this) }/>
            </div>
        );

        let opSwitch = null;
        if (this.props.showOpSwitch) {
            opSwitch = (
                <FilterOpSwitch selected={ filterData.op }
                    onSelect={ this.onChangeOp.bind(this) }/>
            );
        }

        return (
            <li className="FilterListItem">
                { opSwitch }
                { filter }
            </li>
        );
    }

    onRemove() {
        if (this.props.onRemove) {
            this.props.onRemove();
        }
    }

    onChangeConfig(config) {
        if (this.props.onChangeConfig) {
            this.props.onChangeConfig(config);
        }
    }

    onChangeOp(op) {
        if (this.props.onChangeOp) {
            this.props.onChangeOp(op);
        }
    }
}
