import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';


@injectIntl
export default class Link extends React.Component {
    static propTypes = React.PropTypes.oneOf([{
        msgId: React.PropTypes.string.isRequired,
        msgValues: React.PropTypes.object,
        className: React.PropTypes.string,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
        target: React.PropTypes.string,
    }, {
        children: React.PropTypes.object,
        className: React.PropTypes.string,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
        target: React.PropTypes.string,
    }]);

    render() {
        const formatMessage = this.props.intl.formatMessage;

        let label = this.props.children ||
            formatMessage({ id: this.props.msgId }, this.props.msgValues);

        let classes = cx('Link', this.props.className);

        return (
            <a className={ classes }
                href={ this.props.href } target={ this.props.target }
                onClick={ this.props.onClick }>
                { label }
            </a>
        );
    }
}
