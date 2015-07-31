import React from 'react/addons';
import cx from 'classnames';

import FluxComponent from '../../FluxComponent';


export default class ActionListItem extends FluxComponent {
    constructor(props) {
        super(props, {
            formats: {
                time: {
                    'whm': {
                        day: 'long',
                        hour: 'numeric',
                        minute: 'numeric'
                    }
                }
            }
        });

        this.state = {
            expanded: false
        };
    }

    render() {
        var action = this.props.action;
        var actionDate = new Date(action.start_time);

        var classNames = cx({
            'actionlist-item': true,
            'expanded': this.state.expanded
        });

        return (
            <li className={ classNames }
                onClick={ this.onClick.bind(this) }>

                <span className="time">
                    { actionDate.toISOString().substr(11,5) }</span>
                <span className="date">
                    { actionDate.toDateString() }</span>
                <span className="activity">
                    { action.activity.title }</span>
                <span className="location">
                    { action.location.title }</span>
                <ul className="operations">
                    <li className="operation">
                        <a onClick={ this.onEditClick.bind(this) }>
                            Edit</a></li>
                    <li className="operation">
                        <a onClick={ this.onSendClick.bind(this) }>
                            Send reminders</a></li>
                    <li className="operation">
                        <a onClick={ this.onBookClick.bind(this) }>
                            Book all available activists</a></li>
                    <li className="operation">
                        <a onClick={ this.onCancelClick.bind(this) }>
                            Cancel action</a></li>
                </ul>
            </li>
        );
    }

    onClick(ev) {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    onEditClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('edit');
        }
    }

    onSendClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('sendreminders');
        }
    }

    onBookClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('bookall');
        }
    }

    onCancelClick(ev) {
        ev.stopPropagation();
        if (this.props.onOperation) {
            this.props.onOperation('cancel');
        }
    }
}

ActionListItem.propTypes = {
    action: React.PropTypes.object.isRequired,
    onOperation: React.PropTypes.func
};
