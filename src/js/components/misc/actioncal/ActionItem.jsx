import React from 'react/addons';


export default class ActionItem extends React.Component {
    render() {
        const action = this.props.action;

        return (
            <li className="actionday-actionitem"
                onClick={ this.onClick.bind(this) }>
                <span className="activity">
                    { action.activity.title }</span>
                <span className="location">
                    { action.location.title }</span>
            </li>
        );
    }

    onClick(ev) {
        if (this.props.onClick) {
            this.props.onClick(this.props.action);
        }
    }
}

ActionItem.propTypes = {
    onClick: React.PropTypes.func,
    action: React.PropTypes.shape({
        id: React.PropTypes.string,
        location: React.PropTypes.object,
        activity: React.PropTypes.object
    }).isRequired
};
