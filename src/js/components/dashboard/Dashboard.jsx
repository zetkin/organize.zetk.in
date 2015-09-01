import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import Shortcut from './Shortcut';
import ActionResponseWidget from './widgets/ActionResponseWidget';
import OrganizerNotesWidget from './widgets/OrganizerNotesWidget';
import TodayWidget from './widgets/TodayWidget';
import UpcomingActionsWidget from './widgets/UpcomingActionsWidget';


export default class Dashboard extends FluxComponent {
    render() {
        var i;
        var dashboardStore = this.getStore('dashboard');
        var shortcuts = dashboardStore.getShortcuts();
        var widgets = dashboardStore.getWidgets();

        var widgetElements = [];
        var favoriteElements = [];
        var shortcutElements = [];

        for (i = 0; i < shortcuts.length; i++) {
            var shortcut = shortcuts[i];

            if (i < 4) {
                favoriteElements.push(
                    <li key={ shortcut }><Shortcut target={ shortcut }/></li>
                );
            }
            else {
                shortcutElements.push(
                    <li key={ shortcut }><Shortcut target={ shortcut }/></li>
                );
            }
        }

        for (i = 0; i < widgets.length; i++) {
            var WidgetClass = null;
            var widgetData = widgets[i];

            switch (widgetData.type) {
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
                    throw 'Unknown widget type: ' + widgetData.type;
                    break;
            }

            widgetElements.push(
                <li key={ i } className="dashboard-widgetcontainer">
                    <WidgetClass data={ widgetData }/>
                </li>
            );
        }


        return (
            <div className="dashboard">
                <ul className="dashboard-favorites">
                    { favoriteElements }
                </ul>
                <ul className="dashboard-shortcuts">
                    { shortcutElements }
                </ul>
                <ul className="dashboard-widgets">
                    { widgetElements }
                </ul>
            </div>
        );
    }
}
