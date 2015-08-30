import React from 'react/addons';


export default class ActionDayOverflow extends React.Component {
    render() {
        const actions = this.props.actions;
        const actionCount = actions.length;

        return (
            <li className="actionday-pseudoitem actionday-overflow"
                onClick={ this.props.onClick }>
                { actionCount }
            </li>
        );
    }
}

ActionDayOverflow.propTypes = {
    actions: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func
};
