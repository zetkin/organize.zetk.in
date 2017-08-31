import React from 'react';

import Button from '../../../misc/Button';
import LoadingIndicator from '../../../misc/LoadingIndicator';
import RouteList from './RouteList';


export default class RoutePanel extends React.Component {
    render() {
        let generator = this.props.generator;
        let draftList = this.props.draftList;
        let content;

        if (generator.isPending) {
            content = (
                <div className="RoutePanel-progress">
                    <span className="RoutePanel-progressCount">
                        { generator.info.routesCompleted }
                    </span>
                    <LoadingIndicator />;
                </div>
            );
        }
        else if (draftList && draftList.items) {
            content = (
                <div className="RoutePanel-drafts">
                    <RouteList list={ draftList }
                        onRouteMouseOver={ this.onRouteMouseOver.bind(this) }
                        onRouteMouseOut={ this.onRouteMouseOut.bind(this) }
                        />
                    <div className="RoutePanel-buttons">
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
            content = (
                <div className="RoutePanel-config">
                    <div className="RoutePanel-buttons">
                        <Button
                            className="RoutePanel-generateButton"
                            labelMsg="panes.allRoutes.routePanel.generateButton"
                            onClick={ this.onGenerateButtonClick.bind(this) }
                            />
                    </div>
                </div>
            );
        }

        return (
            <div className="RoutePanel">
                { content }
            </div>
        );
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
