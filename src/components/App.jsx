import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import cx from 'classnames';

import AlertMessages from './misc/AlertMessages';
import GoogleAnalytics from './misc/GoogleAnalytics';
import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';
import KeyboardShortcuts from './KeyboardShortcuts';
import { clearSearch } from '../actions/search';

import Section from './sections/Section';


@connect(state => state)
@DragDropContext(HTML5Backend)
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { animationComplete: false };
    }

    componentDidMount() {
      setTimeout(() => {
        this.setState({ animationComplete: true });
      }, 6000);
    }

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
            case 'survey':
            case 'canvass':
            case 'settings':
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

        let appClasses = cx('App', {
          'animationComplete': this.state.animationComplete
        });

        return (
            <html>
                <head>
                    <script src="https://use.typekit.net/tqq3ylv.js"></script>
                    <script>{"try{Typekit.load({ async: true })}catch(e){}"}</script>
                    <title>Zetkin Organize</title>
                    <script src="/static/main.js"></script>
                    <link rel="stylesheet" type="text/css"
                        href="/static/css/style.css"/>
                    <script type="text/javascript"
                          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCih1zeZELzFJxP2SFkNJVDLs2ZCT_y3gY&libraries=visualization,geometry"/>
                    <link rel="icon" type="image/png"
                        href="/static/images/favicon.png"/>
                </head>
                <body>
                    <div className={appClasses}>
                        <Header/>
                        <div className="App-main">
                            { section }
                        </div>
                        <KeyboardShortcuts/>
                        <AlertMessages/>
                    </div>
                    <script type="text/json"
                        id="App-initialState"
                        dangerouslySetInnerHTML={{ __html: stateJson }}/>
                    <GoogleAnalytics/>
                </body>
            </html>
        );
    }
}
