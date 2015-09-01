import React from 'react/addons';

import ActionDay from './ActionDay';


export default class ActionMiniCalendar extends React.Component {
    render() {
        const actions = this.props.actions;

        var startDate, endDate;

        if (actions.length) {
            startDate = new Date(actions[0].start_time);
            endDate = new Date(actions[actions.length-1].end_time);
        }
        else {
            startDate = new Date();
            endDate = new Date();
        }

        var d = new Date(startDate.toDateString());
        var days = [];
        var idx = 0;

        while (d <= endDate) {
            var dayActions = [];

            while (idx < actions.length) {
                const action = actions[idx];
                const ad = new Date(action.start_time);

                if (d.getYear() == ad.getYear()
                    && d.getMonth() == ad.getMonth()
                    && d.getDate() == ad.getDate()) {

                    dayActions.push(action);

                    idx++;
                }
                else {
                    break;
                }
            }

            days.push(
                <ActionDay date={ new Date(d) } actions={ dayActions }
                    maxVisible={ 3 }
                    onSelect={ this.props.onSelectDay }
                    onAddAction={ this.props.onAddAction }
                    onMoveAction={ this.props.onMoveAction }
                    onSelectAction={ this.props.onSelectAction }/>
            );

            d.setDate(d.getDate() + 1);
        }

        return (
            <div className="actionminicalendar">
                { days }
            </div>
        );
    }
}

ActionMiniCalendar.propTypes = {
    actions: React.PropTypes.array.isRequired
};
