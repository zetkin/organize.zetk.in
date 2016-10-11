import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';


@injectIntl
export default class Link extends React.Component {
    static propTypes = {
        msgId: React.PropTypes.string.isRequired,
        msgValues: React.PropTypes.object,
        className: React.PropTypes.string,
    };

    render() {
        const formatMessage = this.props.intl.formatMessage;

        let label = formatMessage({ id: this.props.msgId },
            this.props.msgValues);

        let classes = cx('Link', this.props.className);

        return (
            <a className={ classes }
                onClick={ this.props.onClick }>
                { label }
            </a>
        );
    }
}
