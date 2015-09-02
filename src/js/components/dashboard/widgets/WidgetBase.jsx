import React from 'react/addons';

import FluxComponent from '../../FluxComponent';


export default class WidgetBase extends FluxComponent {
    componentDidMount() {
        const type = this.props.config.type;
        const store = this.getStore('dashboard');
        const data = store.getWidgetData(type);

        if (!data) {
            this.getActions('dashboard').loadWidgetData(type);
        }
    }

    render() {
        const type = this.props.config.type;
        const classes = 'dashboard-widget dashboard-widget-' + type;

        return (
            <div className={ classes }>
                { this.renderWidget() }
            </div>
        );
    }

    renderWidget() {
        // To be overridden
        throw "renderWidget() must be overridden";
    }
}

WidgetBase.propTypes = {
    config: React.PropTypes.object
};
