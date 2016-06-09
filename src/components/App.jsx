import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';

import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';
import KeyboardShortcuts from './KeyboardShortcuts';
import { clearSearch } from '../actions/search';

import CampaignSection from './sections/campaign/CampaignSection';
import DialogSection from './sections/dialog/DialogSection';
import PeopleSection from './sections/people/PeopleSection';
import MapsSection from './sections/maps/MapsSection';


@connect(state => state)
@DragDropContext(HTML5Backend)
export default class App extends React.Component {
    render() {
        let stateJson = JSON.stringify(this.props.initialState);

        let SectionComponent;
        switch (this.props.view.section) {
            case 'dashboard':
                SectionComponent = Dashboard;
                break;
            case 'people':
                SectionComponent = PeopleSection;
                break;
            case 'campaign':
                SectionComponent = CampaignSection;
                break;
            case 'dialog':
                SectionComponent = DialogSection;
                break;
            case 'maps':
                SectionComponent = MapsSection;
                break;
            default:
                SectionComponent = NotFoundPage;
                break;
        }

        let section = (
            <SectionComponent section={ this.props.view.section }
                panes={ this.props.view.panes }/>
        );

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
                    <div className="App">
                        <Header onSearchNavigate={ this.onSearchNavigate.bind(this) }/>
                        <div className="App-main">
                            { section }
                        </div>
                        <KeyboardShortcuts
                            onSectionShortcut={ this.onSectionShortcut.bind(this) }
                            onSubSectionShortcut={ this.onSubSectionShortcut.bind(this) }/>
                    </div>
                    <script type="text/json"
                        id="App-initialState"
                        dangerouslySetInnerHTML={{ __html: stateJson }}/>
                </body>
            </html>
        );
    }

    onNavigation() {
        this.props.dispatch(clearSearch());
    }

    onSectionShortcut(path) {
        this.refs.router.navigate(path);
    }

    onSearchNavigate(paneType, params, defaultBase) {
        const router = this.refs.router;
        const curMatch = router.getMatch();
        const curMatchRef = curMatch.route.ref;

        var path = paneType + ':' + params.join(',');

        if (curMatchRef == 'dashboard') {
            path = defaultBase + '/' + path;
        }
        else {
            path = curMatch.path + '/' + path;
        }

        router.navigate(path);
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
