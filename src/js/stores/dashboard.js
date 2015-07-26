import { Store } from 'flummox';


export default class DashboardStore extends Store {
    constructor(flux) {
        super();

        // TODO: Listen for actions once they exist
        // TODO: Don't hardcode configuration

        this.setState({
            widgets: [ { type: 'upcoming_campaigns' },{ type: 'upcoming_campaigns' },{ type: 'upcoming_campaigns' },{ type: 'upcoming_campaigns' } ],
            shortcuts: [ 'people', 'campaign', 'contact', 'maps',
                'survey', 'resources', 'meetups', 'finance', 'settings' ]
        });
    }

    getShortcuts() {
        return this.state.shortcuts;
    }

    getWidgets() {
        return this.state.widgets;
    }
}
