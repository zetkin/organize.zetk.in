import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';


export default class InputBase extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.string,
        labelMsg: React.PropTypes.string,
        initialValue: React.PropTypes.string,
        className: React.PropTypes.string,
        maxLength: React.PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    render() {
        let label = null;
        let classes = cx('InputBase', this.props.className);

        if (this.props.labelMsg) {
            label = (
                <Msg tagName="label"
                    id={ this.props.labelMsg }/>
            );
        }
        else if (this.props.label) {
            label = <label>{ this.props.label }</label>;
        }

        return (
            <div className={ classes }>
                { label }
                { this.renderInput() }
            </div>
        );
    }

    onChange(ev) {
        this.props.onValueChange(this.props.name, ev.target.value);
    }
}
