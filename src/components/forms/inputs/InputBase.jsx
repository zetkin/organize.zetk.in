import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';


export default class InputBase extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        labelMsg: React.PropTypes.string,
        initialValue: React.PropTypes.string,
        className: React.PropTypes.string,
        constraints: React.PropTypes.shape({
            min: React.PropTypes.number,
            minLength: React.PropTypes.number,
            maxLength: React.PropTypes.number,
            pattern: React.PropTypes.string,
            required: React.PropTypes.bool,
            step: React.PropTypes.number
        })
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
