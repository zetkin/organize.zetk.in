import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import Button from '../misc/Button';
import { componentClassNames } from '..';


export default class PaneBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrolled: false,
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
        contentDOMNode.focus();

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

        const classes = cx(componentClassNames(this), {
            'PaneBase-scrolled': this.state.scrolled,
            'PaneBase-hasFooter': this.renderPaneFooter(data),
        });

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
            <div ref="pane" className={ classes } id={ this.props.paneData.id }>
                <header className="PaneBase-header">
                    <div className="PaneBase-top">
                    { this.renderPaneTop(data) }
                    </div>
                    { closeButton }
                </header>
                <div ref="content" tabIndex="0" className="PaneBase-content">
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
        if (this.props.paneData.params.length > idx) {
            return this.props.paneData.params[idx];
        }
        else {
            return defaultValue;
        }
    }

    openPane(paneType, ...params) {
        if (this.props.onOpenPane) {
            this.props.onOpenPane(paneType, params);
        }
    }

    gotoPane(paneType, ...params) {
        if (this.props.onReplace) {
            this.props.onReplace(paneType, params);
        }
    }

    pushPane(paneType, ...params) {
        if (this.props.onPushPane) {
            this.props.onPushPane(paneType, params);
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
