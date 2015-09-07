import React from 'react/addons';
import cx from 'classnames';


export default class ViewSwitch extends React.Component {
    render() {
        const states = this.props.states;
        const stateNames = Object.keys(this.props.states);

        return (
            <div className="viewswitch">
            {stateNames.map(function(state) {
                const label = states[state];
                const classes = cx('viewswitch-state-' + state, {
                    'selected': (state == this.props.selected)
                });

                return <button key={ state } className={ classes }
                    onClick={ this.onLabelClick.bind(this, state) }>
                        { label }</button>
            }, this)}
            </div>
        );
    }

    onLabelClick(state) {
        if (this.props.onSwitch) {
            this.props.onSwitch(state);
        }
    }
}

ViewSwitch.propTypes = {
    states: React.PropTypes.object.isRequired,
    selected: React.PropTypes.string.isRequired,
    onSwitch: React.PropTypes.func
};
