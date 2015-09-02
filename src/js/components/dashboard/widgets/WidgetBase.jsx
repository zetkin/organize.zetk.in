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

        const store = this.getStore('dashboard');
        const data = store.getWidgetData(type);

        // TODO: Add loading indicator
        const content = data?
            this.renderWidget(data) : "Loading";

        return (
            <div className={ classes }>
                { content }
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
