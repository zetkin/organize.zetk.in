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
                    <div className="pane-top">
                    { this.renderPaneTop(data) }
                    </div>
                    <a className="section-pane-closelink"
                        onClick={ this.onCloseClick.bind(this) }/>
                    <h2>{ this.getPaneTitle(data) }</h2>
                    <small>{ this.getPaneSubTitle(data) }</small>
                </header>
                <div className="section-pane-content">
                    { this.renderPaneContent(data) }
                </div>
            </div>
        );
    }

    renderPaneTop(data) {
        return null;
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

    getParam(idx, defaultValue) {
        if (this.props.params.length > idx) {
            return this.props.params[idx];
        }
        else {
            return defaultValue;
        }
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
        var parentPathElements = pathElements.slice(0, pathElements.length - 1);
        var parentPath = parentPathElements.join('/');

        this.context.router.navigate(parentPath);
    }

    onCloseClick(ev) {
        this.closePane();
    }
}

PaneBase.contextTypes.router = React.PropTypes.any;
