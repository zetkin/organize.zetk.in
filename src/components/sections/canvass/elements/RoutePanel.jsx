import React from 'react';
import cx from 'classnames';

import Button from '../../../misc/Button';
import LoadingIndicator from '../../../misc/LoadingIndicator';
import RouteList from './RouteList';


export default class RoutePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'routes',
        };
    }

    render() {
        let content;
        let classes;

        if (this.state.viewMode == 'routes') {
            content = this.renderRouteList();
        }
        else if (this.state.viewMode == 'generator') {
            content = this.renderGenerator();
        }

        classes = cx('RoutePanel', this.state.viewMode);

        return (
            <div className={ classes }>
                <div className="RoutePanel-tabs">
                    <Button
                        className="RoutePanel-routesTab"
                        labelMsg="panes.allRoutes.routePanel.tabs.routes"
                        onClick={ this.onTabClick.bind(this, 'routes') }
                        />
                    <Button
                        className="RoutePanel-generatorTab"
                        labelMsg="panes.allRoutes.routePanel.tabs.generator"
                        onClick={ this.onTabClick.bind(this, 'generator') }
                        />
                </div>
                <div className="RoutePanel-content">
                    { content }
                </div>
            </div>
        );
    }

    renderRouteList() {
        let routeList = this.props.routeList;

        if (!routeList || routeList.items.length == 0) {
        }
        else if (routeList.isPending) {
        }
        else {
            return (
                <RouteList list={ routeList }
                    onRouteMouseOver={ this.onRouteMouseOver.bind(this) }
                    onRouteMouseOut={ this.onRouteMouseOut.bind(this) }
                    />
            );
        }
    }

    renderGenerator() {
        let generator = this.props.generator;
        let draftList = this.props.draftList;

        if (generator.isPending) {
            return (
                <div className="RoutePanel-progress">
                    <span className="RoutePanel-progressCount">
                        { generator.info.routesCompleted }
                    </span>
                    <LoadingIndicator />;
                </div>
            );
        }
        else if (draftList && draftList.items) {
            return (
                <div className="RoutePanel-drafts">
                    <RouteList list={ draftList }
                        onRouteMouseOver={ this.onRouteMouseOver.bind(this) }
                        onRouteMouseOut={ this.onRouteMouseOut.bind(this) }
                        />
                    <div className="RoutePanel-buttons">
                        <Button
                            className="RoutePanel-commitButton"
                            labelMsg="panes.allRoutes.routePanel.commitButton"
                            onClick={ this.props.onCommitDrafts }
                            />
                        <Button
                            className="RoutePanel-discardButton"
                            labelMsg="panes.allRoutes.routePanel.discardButton"
                            onClick={ this.props.onDiscardDrafts }
                            />
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="RoutePanel-config">
                    <Button
                        className="RoutePanel-generateButton"
                        labelMsg="panes.allRoutes.routePanel.generateButton"
                        onClick={ this.onGenerateButtonClick.bind(this) }
                        />
                </div>
            );
        }
    }

    onTabClick(tab) {
        this.setState({
            viewMode: tab,
        });
    }

    onGenerateButtonClick() {
        if (this.props.onGenerate) {
            let addresses = this.props.addressList.items.map(i => i.data.id);
            let config = {
                routeSize: 300,
            };

            this.props.onGenerate(addresses, config);
        }
    }

    onRouteMouseOver(route) {
        if (this.props.onRouteMouseOver) {
            this.props.onRouteMouseOver(route);
        }
    }

    onRouteMouseOut(route) {
        if (this.props.onRouteMouseOut) {
            this.props.onRouteMouseOut(route);
        }
    }
}
