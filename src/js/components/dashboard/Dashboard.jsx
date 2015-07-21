import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import Shortcut from './Shortcut';
import UpcomingCampaignsWidget from './widgets/UpcomingCampaignsWidget';


export default class Dashboard extends FluxComponent {
    render() {
        var i;
        var dashboardStore = this.getStore('dashboard');
        var shortcuts = dashboardStore.getShortcuts();
        var widgets = dashboardStore.getWidgets();

        var widgetElements = [];
        var favoriteElements = [];
        var shortcutElements = [];

        for (i in shortcuts) {
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

        for (i in widgets) {
            var WidgetClass = null;
            var widgetData = widgets[i];

            switch (widgetData.type) {
                case 'upcoming_campaigns':
                    WidgetClass = UpcomingCampaignsWidget;
                    break;

                default:
                    throw 'Unknown widget type: ' + widgetData.type;
                    break;
            }

            widgetElements.push(<WidgetClass key={ i } data={ widgetData }/>);
        }


        return (
            <div id="dashboard">
                <ul id="dashboard-favorites">
                    { favoriteElements }
                </ul>
                <ul id="dashboard-shortcuts">
                    { shortcutElements }
                </ul>
                <ul id="dashboard-widgets">
                    { widgetElements }
                </ul>
            </div>
        );
    }
}
