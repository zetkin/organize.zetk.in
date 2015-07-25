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
        var data = this.getRenderData();

        return (
            <div className="section-pane">
                <header>
                    <h2>{ this.getPaneTitle(data) }</h2>
                    <small>{ this.getPaneSubTitle(data) }</small>
                </header>
                <div className="section-pane-content">
                    { this.renderPaneContent(data) }
                </div>
            </div>
        );
    }

    getPaneTitle(data) {
        throw "Must implement getPaneTitle()";
    }

    getPaneSubTitle(data) {
        return null;
    }

    renderPaneContent(data) {
        return null;
    }

    getRenderData() {
        return {};
    }

    subPath(path) {
        return this.props.panePath + '/' + path;
    }

    subPanePath(paneType, ...params) {
        var urlSegment = paneType;
        if (params.length) {
            urlSegment += ':' + params.join(',');
        }

        return this.subPath(urlSegment);
    }

    gotoSubPath(path) {
        this.context.router.navigate(this.subPath(path));
    }

    gotoSubPane(paneType, ...params) {
        this.context.router.navigate(this.subPanePath(paneType, ...params));
    }
}

PaneBase.contextTypes.router = React.PropTypes.any;
