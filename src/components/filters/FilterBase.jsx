import React from 'react';
import cx from 'classnames';

import { componentClassNames } from '../';


export default class FilterBase extends React.Component {
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

    onFormSubmit(ev) {
        ev.preventDefault();

        if (this.props.onFilterChange) {
            const config = this.getConfig();
            this.props.onFilterChange(config);
        }
    }
}

FilterBase.propTypes = {
    config: React.PropTypes.object.isRequired
};
