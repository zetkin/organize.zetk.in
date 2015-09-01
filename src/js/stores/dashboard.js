import { Store } from 'flummox';


export default class DashboardStore extends Store {
    constructor(flux) {
        super();

        // TODO: Listen for actions once they exist
        // TODO: Don't hardcode configuration

        this.setState({
            widgets: [
                { type: 'today' },
                { type: 'upcoming_actions' },
                { type: 'action_response' },
                { type: 'organizer_notes' }
            ],
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
