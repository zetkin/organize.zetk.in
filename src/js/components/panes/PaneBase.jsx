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
        var classNames = ['section-pane'];

        if (this.props.paneType) {
            classNames.push('section-pane-' + this.props.paneType);
        }

        return (
            <div className={ classNames.join(' ') }>
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

    closePane() {
        var pathElements = this.props.panePath.split('/');
        var parentPathElements = pathElements.slice(0, pathElements.length-1);
        var parentPath = parentPathElements.join('/');

        this.context.router.navigate(parentPath);
    }
}

PaneBase.contextTypes.router = React.PropTypes.any;
