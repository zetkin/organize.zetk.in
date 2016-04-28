import React from 'react';

import FluxComponent from '../FluxComponent';
import Footer from './Footer';
import Shortcut from './Shortcut';
import DraggableWidget from './widgets/DraggableWidget';
import ActionResponseWidget from './widgets/ActionResponseWidget';
import OrganizerNotesWidget from './widgets/OrganizerNotesWidget';
import TodayWidget from './widgets/TodayWidget';
import UpcomingActionsWidget from './widgets/UpcomingActionsWidget';


export default class Dashboard extends FluxComponent {
    componentDidMount() {
        this.listenTo('dashboard', this.forceUpdate);
    }

    render() {
        var i;
        var dashboardStore = this.getStore('dashboard');
        var shortcuts = dashboardStore.getShortcuts();
        var widgets = dashboardStore.getWidgets();

        var widgetElements = [];
        var favoriteElements = [];
        var shortcutElements = [];

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

        for (i = 0; i < shortcuts.length; i++) {
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

        for (i = 0; i < widgets.length; i++) {
            var WidgetClass = null;
            var widgetConfig = widgets[i];

            switch (widgetConfig.type) {
                case 'action_response':
                    WidgetClass = ActionResponseWidget;
                    break;
                case 'organizer_notes':
                    WidgetClass = OrganizerNotesWidget;
                    break;
                case 'today':
                    WidgetClass = TodayWidget;
                    break;
                case 'upcoming_actions':
                    WidgetClass = UpcomingActionsWidget;
                    break;

                default:
                    throw 'Unknown widget type: ' + widgetConfig.type;
                    break;
            }

            widgetElements.push(
                <DraggableWidget key={ widgetConfig.type } config={ widgetConfig }
                    onMoveWidget={ this.onMoveWidget.bind(this) }>
                    <WidgetClass config={ widgetConfig }/>
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
        this.getActions('dashboard').moveWidget(widget.type, before.type);
    }
}
