import React from 'react';
import { injectIntl } from 'react-intl';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import cx from 'classnames';

import AlertMessages from './misc/AlertMessages';
import Header from './header/Header';
import Dashboard from './dashboard/Dashboard';
import NotFoundPage from './NotFoundPage';
import KeyboardShortcuts from './KeyboardShortcuts';
import { clearSearch } from '../actions/search';

import Section from './sections/Section';
import CleanStateJson from '../common/misc/CleanStateJson';


@connect(state => state)
@injectIntl
@DragDropContext(HTML5Backend)
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            animationComplete: props.view.section !== ''
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ animationComplete: true });
        }, 5000);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.view.section == '' && this.props.view.section != '') {
            this.setState({ animationComplete: true });
        }
    }

    render() {
        const sectionType = this.props.view.section;

        let stateJson = JSON.stringify(this.props.initialState);

        let SectionComponent;
        switch (sectionType) {
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
            <SectionComponent section={ sectionType }
                dispatch={ this.props.dispatch }
                panes={ this.props.view.panes }/>
        );

        let appClasses = cx('App', {
          'animationComplete': this.state.animationComplete
        });

        const titles = [ 'Zetkin Organize' ];
        if (!!sectionType) {
            titles.push(this.props.intl.formatMessage({ id: `sections.labels.${sectionType}` }));

            if (this.props.view.panes.length) {
                const subSectionType = this.props.view.panes[0].type;
                const subSectionMsgId = `sections.subSections.${sectionType}.${subSectionType}`;
                if (this.props.intl.messages[subSectionMsgId]) {
                    titles.push(this.props.intl.formatMessage({ id: subSectionMsgId }));
                }
            }
        }

        const title = titles.concat().reverse().join(' | ');

        return (
            <html>
                <head>
                    <script src="https://use.typekit.net/tqq3ylv.js"></script>
                    <script>{"try{Typekit.load({ async: true })}catch(e){}"}</script>
                    <title>{ title }</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <script src="/static/main.js"></script>
                    <link rel="stylesheet" type="text/css"
                        href="/static/css/style.css"/>
                    <link rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                    <link rel="icon" type="image/png"
                        href="/static/images/favicon.png"/>
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
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
                    <CleanStateJson state={this.props.initialState}/>
                </body>
            </html>
        );
    }
}
