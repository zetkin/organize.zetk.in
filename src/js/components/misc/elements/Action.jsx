import React from 'react/addons';


export default class Action extends React.Component {
    render() {
        var a = this.props.action;

        return (
            <span className="action">
                <span className="date">{ a.start_time }</span>
                <span className="activity">{ a.activity.title }</span>
                <span className="location">{ a.location.title }</span>
            </span>
        );
    }
}

Action.propTypes = {
    action: React.PropTypes.object.isRequired
};
