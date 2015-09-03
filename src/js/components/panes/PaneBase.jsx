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

    openPane(paneType, ...params) {
        const paneSegment = panePathSegment(paneType, params);
        if (this.props.onOpenPane) {
            this.props.onOpenPane(paneSegment);
        }
    }

    gotoPane(paneType, ...params) {
        const paneSegment = panePathSegment(paneType, params);
        if (this.props.onReplace) {
            this.props.onReplace(paneSegment);
        }
    }

    pushPane(paneType, ...params) {
        if (this.props.onPushPane) {
            const pathSegment = panePathSegment(paneType, params);
            this.props.onPushPane(pathSegment);
        }
    }

    closePane() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    onCloseClick(ev) {
        this.closePane();
    }
}

PaneBase.propTypes = {
    onClose: React.PropTypes.func,
    onReplace: React.PropTypes.func,
    onOpenPane: React.PropTypes.func,
    onPushPane: React.PropTypes.func
};

function panePathSegment(paneType, params) {
    var paneSegment = paneType;

    if (params.length) {
        paneSegment += ':' + params.join(',');
    }

    return paneSegment;
}
