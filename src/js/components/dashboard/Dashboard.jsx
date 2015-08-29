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
                case 'upcoming_campaigns':
                    WidgetClass = UpcomingCampaignsWidget;
                    break;

                default:
                    throw 'Unknown widget type: ' + widgetData.type;
                    break;
            }

            widgetElements.push(<li key={ 'widget-' + i }><WidgetClass key={ i } data={ widgetData }/></li>);
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
