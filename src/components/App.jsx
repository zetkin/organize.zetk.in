import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';

import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';
import KeyboardShortcuts from './KeyboardShortcuts';
import { clearSearch } from '../actions/search';

import Section from './sections/Section';


@connect(state => state)
@DragDropContext(HTML5Backend)
export default class App extends React.Component {
    render() {
        let stateJson = JSON.stringify(this.props.initialState);

        let SectionComponent;
        switch (this.props.view.section) {
            case '':
                SectionComponent = Dashboard;
                break;
            case 'people':
            case 'campaign':
            case 'dialog':
            case 'maps':
                SectionComponent = Section;
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
                        <Header/>
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
}
