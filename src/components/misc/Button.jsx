import { injectIntl } from 'react-intl';
import React from 'react';


@injectIntl
export default class Button extends React.Component {
    static propTypes = {
        labelMsg: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func,
        className: React.PropTypes.string,
    };

    render() {
        const formatMessage = this.props.intl.formatMessage;

        let label = formatMessage({ id: this.props.labelMsg });
        let className = "Button " + this.props.className;
        return (
            <button className={ className }
                onClick={ this.props.onClick }>
                { label }
            </button>
        );
    }
}
