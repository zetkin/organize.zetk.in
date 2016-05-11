import * as types from '../actions';
import { createList, updateOrAddListItem } from '../utils/store';


export default function dashboard(state = null, action) {
    let widget;

    switch (action.type) {
        case types.LOAD_WIDGET_DATA + '_PENDING':
            widget = { id: action.meta.widgetType };
            return Object.assign({}, state, {
                widgetDataList: updateOrAddListItem(state.widgetDataList,
                    widget.id, widget, { isPending: true, error: null }),
            });

        case types.LOAD_WIDGET_DATA + '_FULFILLED':
            widget = action.payload;
            return Object.assign({}, state, {
                widgetDataList: updateOrAddListItem(state.widgetDataList,
                    widget.id, widget, { isPending: false, error: null }),
            });

        case types.MOVE_WIDGET:
            let moveType = action.payload.moveType;
            let moveWidget = state.widgets.find(w => w.type == moveType);

            let newWidgets = [];
            for (let i = 0; i < state.widgets.length; i++) {
                widget = state.widgets[i];
                if (widget.type == action.payload.beforeType) {
                    newWidgets.push(moveWidget);
                }

                if (widget != moveWidget) {
                    newWidgets.push(widget);
                }
            }

            return Object.assign({}, state, {
                widgets: newWidgets,
            });

        default:
            return state || {
                widgets: [
                    { type: 'today' },
                    { type: 'upcoming_actions' },
                    { type: 'action_response' },
                    { type: 'organizer_notes' }
                ],
                widgetDataList: createList(),
                shortcuts: [ 'people', 'campaign', 'dialog', 'maps',
                    'survey', 'resources', 'meetups', 'finance', 'settings' ]
            };
    }
}
