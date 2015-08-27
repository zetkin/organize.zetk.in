import React from 'react/addons';


export default class ActionDay extends React.Component {
    render() {
        const DAY_LABELS = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

        const date = this.props.date;
        const dateLabel = date.getDate() + '/' + date.getMonth();
        const dayLabel = DAY_LABELS[date.getDay()];

        return (
            <div className="actionday">
                <h3>
                    <span className="date">{ dateLabel }</span>
                    <span className="weekday">{ dayLabel }</span>
                </h3>
                <ul>
                { this.props.actions.map(function(action) {
                    return (
                        <li key={ action.id }
                            className="actionday-actionitem"
                            onClick={ this.onActionClick.bind(this, action) }>
                            <span className="activity">
                                { action.activity.title }</span>
                            <span className="location">
                                { action.location.title }</span>
                        </li>
                    );
                }, this) }
                    <li className="actionday-pseudoitem">
                        <button className="actionday-addbutton"
                            onClick={ this.onAddClick.bind(this) }/>
                    </li>
                </ul>
            </div>
        );
    }

    onActionClick(action) {
        if (this.props.onSelectAction) {
            this.props.onSelectAction(action);
        }
    }

    onAddClick() {
        if (this.props.onAddAction) {
            this.props.onAddAction();
        }
    }
}

ActionDay.propTypes = {
    onSelectAction: React.PropTypes.func,
    onAddAction: React.PropTypes.func
};
