import React from 'react';

import FilterOpSwitch from './FilterOpSwitch';
import { resolveFilterComponent } from '.';


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
        let filter = this.props.filter;
        let FilterComponent = resolveFilterComponent(filter.type);

        let opSwitch = null;
        if (this.props.showOpSwitch) {
            opSwitch = (
                <FilterOpSwitch selected={ filter.op }
                    onSelect={ this.onChangeOp.bind(this) }/>
            );
        }

        return (
            <li className="FilterListItem">
                { opSwitch }
                <FilterComponent config={ filter.config }
                    onFilterRemove={ this.onRemove.bind(this) }
                    onConfigChange={ this.onChangeConfig.bind(this) }/>
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
