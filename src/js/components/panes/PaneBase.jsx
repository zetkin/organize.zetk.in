import React from 'react/addons';

import FluxComponent from '../FluxComponent';


class EmptyIndex extends React.Component {
    render() {
        return null;
    }
}

class EmptyNotFound extends React.Component {
    render() {
        return null;
    }
}

export default class PaneBase extends FluxComponent {
    render() {
        return (
            <div className="section-pane">
                <header>
                    <h2>{ this.getPaneTitle() }</h2>
                    <small>{ this.getPaneSubTitle() }</small>
                </header>
                <div className="section-pane-content">
                    { this.renderPaneContent() }
                </div>
            </div>
        );
    }

    getPaneTitle() {
        throw "Must implement getPaneTitle()";
    }

    getPaneSubTitle() {
        return null;
    }

    renderPaneContent() {
        return null;
    }

    subPath(path) {
        return this.props.panePath + '/' + path;
    }

    subPanePath(paneType, ...params) {
        return this.subPath(paneType + ':' + params.join(','));
    }

    gotoSubPath(path) {
        this.context.router.navigate(this.subPath(path));
    }

    gotoSubPane(paneType, ...params) {
        this.context.router.navigate(this.subPanePath(paneType, ...params));
    }
}

PaneBase.contextTypes.router = React.PropTypes.any;
