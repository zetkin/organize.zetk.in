import React from 'react/addons';


export default class ActionWeek extends React.Component {
    render() {
        return (
            <div className="ActionWeek">
                <h2>v. { this.props.week }</h2>
                { this.props.children }
            </div>
        );
    }
}
