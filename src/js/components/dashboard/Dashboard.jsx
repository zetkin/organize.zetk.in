import React from 'react/addons';

import FluxComponent from '../FluxComponent';
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
            <div className="dashboard">
                <ul className="dashboard-favorites">
                    { favoriteElements }
                </ul>
                <ul className="dashboard-shortcuts">
                    { shortcutElements }
                </ul>
                <div className="dashboard-widgets">
                    { widgetElements }
                </div>
            </div>
        );
    }

    onMoveWidget(widget, before) {
        this.getActions('dashboard').moveWidget(widget.type, before.type);
    }
}
