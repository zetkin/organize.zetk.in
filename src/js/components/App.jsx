import React from 'react/addons';
import Router from 'react-router-component';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import FluxComponent from './FluxComponent';
import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';
import KeyboardShortcuts from './KeyboardShortcuts';

import CampaignSection from './sections/campaign/CampaignSection';
import PeopleSection from './sections/people/PeopleSection';
import MapsSection from './sections/maps/MapsSection';


@DragDropContext(HTML5Backend)
export default class App extends FluxComponent {
    render() {
        var json = {
            __html: this.context.flux.serialize()
        };

        return (
            <html>
                <head>
                    <script src="/static/js/main.js"></script>
                    <link rel="stylesheet" type="text/css"
                        href="/static/css/style.css"/>
                    <script type="text/javascript"
                          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCih1zeZELzFJxP2SFkNJVDLs2ZCT_y3gY&libraries=visualization"/>
                </head>
                <body>
                    <div id="app">
                        <Header />
                        <Router.Locations id="main" ref="router"
                            onNavigation={ this.onNavigation.bind(this) }
                            path={ this.props.path }>

                            <Router.Location ref="dashboard" path="/"
                                handler={ Dashboard }/>

                            <Router.Location ref="people" path="/people(/*)"
                                handler={ PeopleSection }/>

                            <Router.Location ref="campaign" path="/campaign(/*)"
                                handler={ CampaignSection }/>

                            <Router.Location ref="maps" path="/maps(/*)"
                                handler={ MapsSection }/>

                            <Router.NotFound ref="notfound"
                                handler={ NotFoundPage }/>
                        </Router.Locations>
                        <KeyboardShortcuts
                            onSectionShortcut={ this.onSectionShortcut.bind(this) }
                            onSubSectionShortcut={ this.onSubSectionShortcut.bind(this) }/>
                    </div>
                    <script type="text/json"
                        id="bootstrap-data"
                        dangerouslySetInnerHTML={ json }/>
                </body>
            </html>
        );
    }

    onNavigation() {
        this.getActions('search').clearSearch();
    }

    onSectionShortcut(path) {
        this.refs.router.navigate(path);
    }

    onSubSectionShortcut(index) {
        var curMatch = this.refs.router.getMatch();
        var router = this.refs.router;
        var ref = curMatch.route.ref;

        if (ref !== 'dashboard' && ref !== 'notfound') {
            return router.refs[ref].gotoSubSectionAt(index);
        }
        else {
            return false;
        }
    }
}
