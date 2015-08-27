import React from 'react/addons';


export default class ActionWeek extends React.Component {
    render() {
        const week = this.props.firstDate.getWeekNumber();

        return (
            <div className="actionweek">
                <h2>v. { week }</h2>
                { this.props.children }
            </div>
        );
    }
}
