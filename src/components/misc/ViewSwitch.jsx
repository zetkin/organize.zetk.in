import { injectIntl } from 'react-intl';
import React from 'react';
import cx from 'classnames';


@injectIntl
export default class ViewSwitch extends React.Component {
    static propTypes = {
        states: React.PropTypes.object.isRequired,
        selected: React.PropTypes.string.isRequired,
        onSwitch: React.PropTypes.func,
        className: React.PropTypes.string,
    };

    render() {
        const states = this.props.states;
        const stateNames = Object.keys(this.props.states);

        const formatMessage = this.props.intl.formatMessage;
        let className = cx("ViewSwitch", this.props.className);

        return (
            <div className={ className }>
            {stateNames.map(function(state) {
                const label = formatMessage({ id: states[state] });
                const classes = cx('ViewSwitch-state-' + state, {
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
