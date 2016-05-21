import React from 'react';
import cx from 'classnames';

import { componentClassNames } from '../';


export default class FilterBase extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        onConfigChange: React.PropTypes.func,
    };

    render() {
        const config = this.props.config;
        const classes = cx(componentClassNames(this));

        return (
            <div className={ classes }>
                <a className="FilterBase-removeButton"
                    onClick={ this.onClickRemove.bind(this) }>x</a>
                { this.renderFilterForm(config) }
            </div>
        );
    }

    renderFilterForm(config) {
        return null;
    }

    getConfig() {
        return this.refs.form.getValues();
    }

    onClickRemove(ev) {
        if (this.props.onFilterRemove) {
            this.props.onFilterRemove();
        }
    }

    onConfigChange() {
        if (this.props.onConfigChange) {
            let config = this.getConfig();
            this.props.onConfigChange(config);
        }
    }
}
