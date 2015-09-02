import { Store } from 'flummox';


export default class DashboardStore extends Store {
    constructor(flux) {
        super();

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

        const dashboardActions = flux.getActions('dashboard');
        this.register(dashboardActions.moveWidget, this.onMoveWidget);
    }

    getShortcuts() {
        return this.state.shortcuts;
    }

    getWidgets() {
        return this.state.widgets;
    }

    onMoveWidget(move) {
        const widgets = this.state.widgets;
        const moveWidget = widgets.find(w => w.type == move.moveType);

        var newWidgets = [];
        for (let i = 0; i < widgets.length; i++) {
            let widget = widgets[i];
            if (widget.type == move.beforeType) {
                newWidgets.push(moveWidget);
            }

            if (widget != moveWidget) {
                newWidgets.push(widget);
            }
        }

        this.setState({
            widgets: newWidgets
        });
    }
}
