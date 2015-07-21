import { Store } from 'flummox';


export default class DashboardStore extends Store {
    constructor(flux) {
        super();

        // TODO: Listen for actions once they exist
        // TODO: Don't hardcode configuration

        this.setState({
            shortcuts: [ 'people', 'campaign', 'contact', 'maps',
                'survey', 'resources', 'meetups', 'finance', 'settings' ]
        });
    }

    getShortcuts() {
        return this.state.shortcuts;
    }
}
