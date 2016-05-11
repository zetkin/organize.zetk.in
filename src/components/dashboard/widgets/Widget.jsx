import cx from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import ActionResponseWidget from './ActionResponseWidget';
import OrganizerNotesWidget from './OrganizerNotesWidget';
import TodayWidget from './TodayWidget';
import UpcomingActionsWidget from './UpcomingActionsWidget';
import { componentClassNames } from '../../';
import { loadWidgetData } from '../../../actions/dashboard';
import { getListItemById } from '../../../utils/store';


@connect(state => state)
export default class Widget extends React.Component {
    componentDidMount() {
        let type = this.props.config.type;
        let dataList = this.props.dashboard.widgetDataList;
        let data = getListItemById(dataList, type);

        if (!data) {
            this.props.dispatch(loadWidgetData(type));
        }
    }

    render() {
        let config = this.props.config;
        let dataList = this.props.dashboard.widgetDataList;
        let data = getListItemById(dataList, config.type);
        let WidgetClass;

        switch (config.type) {
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
                throw 'Unknown widget type: ' + config.type;
                break;
        }

        let content = null;
        if (data && data.data && !data.isPending) {
            content = <WidgetClass data={ data.data }/>;
        }
        else if (data && data.error) {
            // TODO: Use error indicator
            content = 'Error loading widget data';
        }
        else {
            // TODO: Use loading indicator
            content = 'Loading...';
        }

        return (
            <div className={ 'Widget' }>
                { content }
            </div>
        );
    }

    renderWidget() {
        // To be overridden
        throw "renderWidget() must be overridden";
    }
}

Widget.propTypes = {
    config: React.PropTypes.object
};
