import React from 'react';
import { connect } from 'react-redux';

import Footer from './Footer';
import Shortcut from './Shortcut';
import DraggableWidget from './widgets/DraggableWidget';
import Widget from './widgets/Widget';
import { moveWidget } from '../../actions/dashboard';


@connect(state => state)
export default class Dashboard extends React.Component {
    render() {
        let dashboardStore = this.props.dashboard;
        let shortcuts = dashboardStore.shortcuts;
        let widgets = dashboardStore.widgets;

        let widgetElements = [];
        let favoriteElements = [];
        let shortcutElements = [];

        // TODO: Move to localization
        const labels = {
            'people': 'People',
            'campaign': 'Campaign',
            'dialog': 'Dialog',
            'maps': 'Maps',
            'survey': 'Survey',
            'resources': 'Resources',
            'meetups': 'Meetups',
            'finance': 'Finance',
            'settings': 'Settings'
        };

        for (let i = 0; i < shortcuts.length; i++) {
            let shortcut = shortcuts[i];
            let classes = 'Dashboard-shortcut Dashboard-shortcut-' + shortcut;
            let label = labels[shortcut];

            if (i < 4) {
                favoriteElements.push(
                    <li className={ classes } key={ shortcut }>
                        <Shortcut target={ shortcut } label={ label }/></li>
                );
            }
            else {
                shortcutElements.push(
                    <li key={ shortcut }>
                        <Shortcut target={ shortcut } label={ label }/></li>
                );
            }
        }

        for (let i = 0; i < widgets.length; i++) {
            var widgetConfig = widgets[i];

            widgetElements.push(
                <DraggableWidget key={ widgetConfig.type } config={ widgetConfig }
                    onMoveWidget={ this.onMoveWidget.bind(this) }>
                    <Widget config={ widgetConfig }/>
                </DraggableWidget>
            );
        }


        return (
            <div className="Dashboard">
                <ul className="Dashboard-favorites">
                    { favoriteElements }
                </ul>
                <ul className="Dashboard-shortcuts">
                    { shortcutElements }
                </ul>
                <div className="Dashboard-widgets">
                    { widgetElements }
                </div>
                <Footer/>
            </div>
        );
    }

    onMoveWidget(widget, before) {
        this.props.dispatch(moveWidget(widget.type, before.type));
    }
}
