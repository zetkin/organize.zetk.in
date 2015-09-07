import React from 'react/addons';
import cx from 'classnames';

import FluxComponent from '../FluxComponent';


export default class PaneBase extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            scrolled: false
        };
    }

    componentDidMount() {
        const paneDOMNode = React.findDOMNode(this.refs.pane);

        paneDOMNode.onPaneScroll = (function onPaneScroll(scrollTop) {
            this.setState({
                scrolled: (scrollTop != 0)
            });
        }).bind(this);
    }

    componentWillUnmount() {
        const paneDOMNode = React.findDOMNode(this.refs.pane);
        paneDOMNode.onPaneScroll = null;
    }

    render() {
        const data = this.getRenderData();
        const paneType = this.props.paneType;

        const classes = cx('section-pane-' + paneType, {
            'section-pane': true,
            'scrolled': this.state.scrolled
        });

        var toolbar = this.getPaneTools();
        if (toolbar) {
            toolbar = (
                <div className="section-pane-toolbar">
                    { toolbar }
                </div>
            );
        }

        var title = null;
        var subTitle = null;
        var closeButton = null;
        if (!this.props.isBase) {
            closeButton = (
                <a className="section-pane-closelink"
                    onClick={ this.onCloseClick.bind(this) }/>
            );

            title = <h2>{ this.getPaneTitle(data) }</h2>;
            subTitle = <small>{ this.getPaneSubTitle(data) }</small>;
        }

        return (
            <div ref="pane" className={ classes }>
                <header>
                    <div className="pane-top">
                    { this.renderPaneTop(data) }
                    </div>
                    { closeButton }
                    { toolbar }
                </header>
                <div className="section-pane-content">
                    { title }
                    { subTitle }
                    { this.renderPaneContent(data) }
                </div>
            </div>
        );
    }

    renderPaneTop(data) {
        return null;
    }

    getPaneTools(data) {
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
    isBase: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onReplace: React.PropTypes.func,
    onOpenPane: React.PropTypes.func,
    onPushPane: React.PropTypes.func
};

PaneBase.defaultProps = {
    isBase: false
};

function panePathSegment(paneType, params) {
    var paneSegment = paneType;

    if (params.length) {
        paneSegment += ':' + params.join(',');
    }

    return paneSegment;
}
