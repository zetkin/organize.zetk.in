import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import Shortcut from './Shortcut';


export default class Dashboard extends FluxComponent {
    render() {
        var i;
        var dashboardStore = this.getStore('dashboard');
        var shortcuts = dashboardStore.getShortcuts();

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


        return (
            <div id="dashboard">
                <ul id="dashboard-favorites">
                    { favoriteElements }
                </ul>
                <ul id="dashboard-shortcuts">
                    { shortcutElements }
                </ul>
            </div>
        );
    }
}
