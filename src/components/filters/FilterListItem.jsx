import React from 'react';

import { resolveFilterComponent } from '.';


export default class FilterListItem extends React.Component {
    static propTypes = {
        filter: React.PropTypes.shape({
            op: React.PropTypes.string,
            type: React.PropTypes.string.isRequired,
            config: React.PropTypes.object.isRequired,
        }).isRequired,
        onRemove: React.PropTypes.func,
        onChangeConfig: React.PropTypes.func,
    };

    render() {
        let filter = this.props.filter;
        let FilterComponent = resolveFilterComponent(filter.type);

        return (
            <li className="FilterListItem">
                <FilterComponent config={ filter.config }
                    onFilterRemove={ this.onRemove.bind(this) }
                    onFilterChange={ this.onChangeConfig.bind(this) }/>
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
}
