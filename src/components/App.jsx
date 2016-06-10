import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';

import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';
import KeyboardShortcuts from './KeyboardShortcuts';
import { clearSearch } from '../actions/search';

import SectionBase from './sections/SectionBase';


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
            case 'campaign':
            case 'dialog':
            case 'maps':
                SectionComponent = SectionBase;
                break;
            default:
                SectionComponent = NotFoundPage;
                break;
        }

        let section = (
            <SectionComponent section={ this.props.view.section }
                dispatch={ this.props.dispatch }
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
                        <KeyboardShortcuts/>
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
}
