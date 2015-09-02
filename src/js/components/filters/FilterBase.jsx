import React from 'react/addons';


export default class FilterBase extends React.Component {
    render() {
        const config = this.props.config;
        const classes = "filter filter-" + config.type;

        return (
            <div className={ classes }>
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
