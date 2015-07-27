import React from 'react/addons';


export default class ViewSwitch extends React.Component {
    render() {
        var stateNames = Object.keys(this.props.states);

        return (
            <div className="viewswitch">
            {stateNames.map(function(state) {
                var label = this.props.states[state];
                return <input key={ state } type="button" value={ label }
                    onClick={ this.onLabelClick.bind(this, state) }/>;
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
