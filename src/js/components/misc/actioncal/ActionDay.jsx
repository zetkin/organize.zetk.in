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
                        <div key={ action.id }
                            className="actionday-actionitem"
                            onClick={ this.onClick.bind(this, action) }>
                            <span className="activity">
                                { action.activity.title }</span>
                            <span className="location">
                                { action.location.title }</span>
                        </div>
                    );
                }, this) }
                </ul>
            </div>
        );
    }

    onClick(action) {
        if (this.props.onSelectAction) {
            this.props.onSelectAction(action);
        }
    }
}

ActionDay.propTypes = {
    onSelectAction: React.PropTypes.func
};
