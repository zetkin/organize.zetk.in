import React from 'react/addons';
import { Locations, Location, NotFound } from 'react-router-component';

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
        var childPanes;
        var childRouter;

        var childPanes = this.getChildPanes();

        if (childPanes && childPanes.length) {
            var LocationFactory = React.createFactory(Location);
            var LocationsFactory = React.createFactory(Locations);
            var NotFoundFactory = React.createFactory(NotFound);
            var routerArgs = [{ contextual: true }];

            childPanes.map(function(pane) {
                routerArgs.push(LocationFactory({
                    path: pane.path,
                    handler: pane.component
                }));
            });

            routerArgs.push(NotFoundFactory({ handler: EmptyNotFound }));
            routerArgs.push(LocationFactory({ path: '/', handler: EmptyIndex }));

            childRouter = LocationsFactory.apply(null, routerArgs);
        }

        return (
            <div className="section-pane">
                <header>
                    <h2>{ this.getPaneTitle() }</h2>
                    <small>{ this.getPaneSubTitle() }</small>
                </header>
                <div className="section-pane-content">
                    { this.renderPaneContent() }
                    { childRouter }
                </div>
            </div>
        );
    }

    getPaneTitle() {
        throw "Must implement getPaneTitle()";
    }

    getPaneSubTitle() {
        return null;
    }

    getChildPanes() {
        return [];
    }

    getChildLocations() {
        return null;
    }

    renderPaneContent() {
        return null;
    }
}
