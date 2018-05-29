import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import Button from '../misc/Button';
import { componentClassNames } from '..';


export default class RootPaneBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrolled: false,
            showFilters: false,
            pendingFilters: {},
            filters: {}
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
        // Check if any filter is applied
        // Get filter values (Object.values not supported in older Node an IE)
        let isFiltered = false;
        if (this.state.pendingFilters) {
            const filterValues = Object.keys(this.state.pendingFilters)
                .map(key => this.state.pendingFilters[key]);

            isFiltered = filterValues.some(element => element);
        }

        const classes = cx(componentClassNames(this), {
            'RootPaneBase-scrolled': this.state.scrolled,
            'RootPaneBase-filtersVisible': this.state.showFilters,
            'RootPaneBase-filtersHidden': !this.state.showFilters,
            'RootPaneBase-filtered': isFiltered,
        });

        let filterDrawer = null;
        let filters = this.getPaneFilters(data, this.state.pendingFilters);
        var toolbar = this.getPaneTools(data);
        

        if (filters || toolbar) {
            let filterButton = null;

            if (filters) {
                filterDrawer = (
                    <div className="RootPaneBase-filterDrawer">
                        <div className="RootPaneBase-filterContent">
                            { filters }
                        </div>
                        <div className="RootPaneBase-filterFooter">
                        <Button key="filterButton"
                            className="RootPaneBase-filterApplyButton"
                            labelMsg="panes.filterApplyButton"
                            onClick={ this.onFilterApplyButtonClick.bind(this) }/>
                        </div>
                    </div>
                );

                let filterButtonLabel = isFiltered ?
                    "panes.filterButtonChange" : "panes.filterButtonShow";
                if (this.state.showFilters) {
                    filterButtonLabel = "panes.filterButtonHide";
                }

                filterButton = (
                    <Button key="filterButton"
                        className="RootPaneBase-filterButton"
                        labelMsg={ filterButtonLabel }
                        onClick={ this.onFilterButtonClick.bind(this) }/>
                );
            }

            toolbar = (
                <div className="RootPaneBase-toolbar">
                    { toolbar }
                    { filterButton }
                </div>
            );
        }

        let footer = null;
        let footerContent = this.renderPaneFooter(data);
        if (footerContent) {
            footer = (
                <footer className="RootPaneBase-footer">
                    { footerContent }
                </footer>
            );
        }

        return (
            <div ref="pane" className={ classes }>
                <header className="RootPaneBase-header">
                    <div className="RootPaneBase-top">
                    { this.renderPaneTop(data) }
                    </div>
                    { toolbar }
                    { filterDrawer }
                </header>
                <div ref="content" className="RootPaneBase-content">
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

    getPaneFilters(data, filters) {
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

    onFilterChange(name, value) {
        this.setState({
            pendingFilters: Object.assign({}, this.state.pendingFilters, {
                [name]: value,
            }),
        });
    }

    onFilterButtonClick() {
        let showFilters = !this.state.showFilters;
        let state = { showFilters };

        if (showFilters) {
            state.pendingFilters = Object.assign({}, this.state.filters);
        }

        this.setState(state);
    }

    onFilterApplyButtonClick() {
        this.setState({
            showFilters: false,
            filters: Object.assign({}, this.state.filters, this.state.pendingFilters),
        }, () => this.onFiltersApply(this.state.filters));
    }

    onFiltersApply(filters) {
        // To be overridden
    }

    onCloseClick(ev) {
        this.closePane();
    }
}

RootPaneBase.propTypes = {
    onClose: React.PropTypes.func,
    onReplace: React.PropTypes.func,
    onOpenPane: React.PropTypes.func,
    onPushPane: React.PropTypes.func
};
