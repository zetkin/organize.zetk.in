import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class InputBase extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        labelMsg: React.PropTypes.string.isRequired,
        initialValue: React.PropTypes.string,
        className: React.PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={ this.props.className }>
                <Msg tagName="label"
                    id={ this.props.labelMsg }/>
                { this.renderInput() }
            </div>
        );
    }

    onChange(ev) {
        this.props.onValueChange(this.props.name, ev.target.value);
    }
}
