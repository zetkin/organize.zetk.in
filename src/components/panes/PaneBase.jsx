import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { componentClassNames } from '..';


export default class PaneBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrolled: false
        };
    }

    componentDidMount() {
        this.onPaneScroll = (function onPaneScroll(ev) {
            const scrolled = (ev.target.scrollTop > 2);

            if (scrolled != this.state.scrolled) {
                this.setState({
                    scrolled: scrolled
                });
            }
        }).bind(this);

        const contentDOMNode = ReactDOM.findDOMNode(this.refs.content);
        contentDOMNode.addEventListener('scroll', this.onPaneScroll);

        const scrolled = (contentDOMNode.scrollTop > 2);
        if (scrolled != this.state.scrolled) {
            this.setState({
                scrolled: scrolled
            });
        }
    }

    componentWillUnmount() {
        const contentDOMNode = ReactDOM.findDOMNode(this.refs.content);
        contentDOMNode.removeEventListener('scroll', this.onPaneScroll);
    }

    render() {
        const data = this.getRenderData();
        const paneType = this.props.paneType;

        const classes = cx(componentClassNames(this), {
            'PaneBase-scrolled': this.state.scrolled
        });

        var toolbar = this.getPaneTools();
        if (toolbar) {
            toolbar = (
                <div className="PaneBase-toolbar">
                    { toolbar }
                </div>
            );
        }

        var title = null;
        var subTitle = null;
        var closeButton = null;
        if (!this.props.isBase) {
            closeButton = (
                <a className="PaneBase-closelink"
                    onClick={ this.onCloseClick.bind(this) }/>
            );

            title = <h2>{ this.getPaneTitle(data) }</h2>;
            subTitle = <small>{ this.getPaneSubTitle(data) }</small>;
        }

        let footer = null;
        let footerContent = this.renderPaneFooter(data);
        if (footerContent) {
            footer = (
                <footer className="PaneBase-footer">
                    { footerContent }
                </footer>
            );
        }

        return (
            <div ref="pane" className={ classes }>
                <header className="PaneBase-header">
                    <div className="PaneBase-top">
                    { this.renderPaneTop(data) }
                    </div>
                    { closeButton }
                    { toolbar }
                </header>
                <div ref="content" className="PaneBase-content">
                    { title }
                    { subTitle }
                    { this.renderPaneContent(data) }
                </div>
                { footer }
            </div>
        );
    }

    renderPaneTop(data) {
        return null;
    }

    renderPaneFooter(data) {
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
