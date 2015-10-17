import React from 'react/addons';
import cx from 'classnames';


export default class ActionDayOverflow extends React.Component {
    render() {
        const actions = this.props.actions;
        const actionCount = actions.length;
        const highlightActions = actions.filter(a => a.highlight);
        const highlightCount = highlightActions.length;

        const label = highlightCount || actionCount;

        const classes = cx({
            'ActionDayOverflow': true,
            'highlight': (highlightCount > 0)
        });

        return (
            <li className={ classes } onClick={ this.props.onClick }>
                { label }
            </li>
        );
    }
}

ActionDayOverflow.propTypes = {
    actions: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func
};
