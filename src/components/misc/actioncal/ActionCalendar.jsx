import React from 'react';

import ActionWeek from './ActionWeek';
import ActionDay from './ActionDay';


export default class ActionCalendar extends React.Component {
    render() {
        const actions = this.props.actions;

        actions.sort((a0, a1) =>
            (new Date(a0.start_time)) - (new Date(a1.start_time)));

        var startDate = this.props.startDate;
        var endDate = this.props.endDate;

        if (!startDate && actions.length > 0) {
            startDate = new Date(actions[0].start_time);
        }

        if (!endDate && actions.length > 0) {
            endDate = new Date(actions[actions.length-1].end_time);
        }

        // Always start on previous Monday
        const startDay = startDate.getDay();
        startDate.setDate(startDate.getDate() + 1 - (startDay? startDay : 7));

        // Always end on a Sunday
        if (endDate.getDay() != 0) {
            // End date is not a Sunday, so use next Sunday
            endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
        }

        // Always show at least one month
        const duration = endDate.getTime() - startDate.getTime();
        if (duration < (31 * 24 * 60 * 60 * 1000)) {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        var d = new Date(startDate.toDateString());
        var weeks = [];
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
                <ActionDay key={ d } date={ new Date(d) } actions={ dayActions }
                    onSelect={ this.props.onSelectDay }
                    onAddAction={ this.onAddAction.bind(this) }
                    onCopyAction={ this.onCopyAction.bind(this) }
                    onMoveAction={ this.onMoveAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
            );

            if (d.getDay() == 0) {
                const week = d.getWeekNumber();
                weeks.push(
                    <ActionWeek key={ week } week={ week }>
                        { days }
                    </ActionWeek>
                );

                days = [];
            }

            d.setDate(d.getDate() + 1);
        }

        return (
            <div className="ActionCalendar">
                { weeks }
            </div>
        );
    }

    onSelectAction(action) {
        if (this.props.onSelectAction) {
            this.props.onSelectAction(action);
        }
    }

    onAddAction(date) {
        if (this.props.onAddAction) {
            this.props.onAddAction(date);
        }
    }

    onMoveAction(action, date) {
        if (this.props.onMoveAction) {
            this.props.onMoveAction(action, date);
        }
    }

    onCopyAction(action, date) {
        if (this.props.onCopyAction) {
            this.props.onCopyAction(action, date);
        }
    }
}

ActionCalendar.propTypes = {
    onSelectDay: React.PropTypes.func,
    onAddAction: React.PropTypes.func,
    onSelectAction: React.PropTypes.func,
    onMoveAction: React.PropTypes.func
};
