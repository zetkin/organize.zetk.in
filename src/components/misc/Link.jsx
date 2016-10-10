import React from 'react';
import { injectIntl } from 'react-intl';


@injectIntl
export default class Link extends React.Component {
    static propTypes = {
        msgId: React.PropTypes.string.isRequired,
        msgValues: React.PropTypes.object,
    };

    render() {
        const formatMessage = this.props.intl.formatMessage;

        let label = formatMessage({ id: this.props.msgId },
            this.props.msgValues);

        return (
            <a onClick={ this.props.onClick }>
                { label }
            </a>
        );
    }
}
