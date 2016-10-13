import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class InputBase extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        labelMsg: React.PropTypes.string,
        initialValue: React.PropTypes.string,
        className: React.PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        let label = null;
        if (this.props.labelMsg) {
            label = (
                <Msg tagName="label"
                    id={ this.props.labelMsg }/>
            );
        }
        return (
            <div className={ this.props.className }>
                { label }
                { this.renderInput() }
            </div>
        );
    }

    onChange(ev) {
        this.props.onValueChange(this.props.name, ev.target.value);
    }
}
