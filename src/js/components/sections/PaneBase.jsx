import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class PaneBase extends FluxComponent {
    render() {
        return (
            <div className="section-pane">
                <header>
                    <h2>{ this.getPaneTitle() }</h2>
                    <small>{ this.getPaneSubTitle() }</small>
                </header>
                <div className="section-pane-content">
                    { this.renderPaneContent() }
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

    renderPaneContent() {
        return null;
    }
}
