import React from 'react/addons';

import FluxComponent from '../../FluxComponent';
import ActionListItem from './ActionListItem';


export default class ActionList extends FluxComponent {
    render() {
        var actions = this.props.actions;
        return (
            <div className="actionlist">
                <ul className="actionlist-columns">
                    <li>Time</li>
                    <li>Activity / Location</li>
                    <li>Contact</li>
                    <li>Participants</li>
                </ul>
                <ul className="actionlist-items">
                    {actions.map(function(action) {
                        return (
                            <ActionListItem key={ action.id }
                                action={ action }/>
                        );
                    }, this)}
                </ul>
            </div>
        );
    }
}

ActionList.propTypes = {
    actions: React.PropTypes.array.isRequired
};
