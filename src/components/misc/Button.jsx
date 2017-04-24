import { injectIntl } from 'react-intl';
import React from 'react';

import cx from 'classnames';

@injectIntl
export default class Button extends React.Component {
    static propTypes = {
        labelMsg: React.PropTypes.string.isRequired,
        labelValues: React.PropTypes.object,
        onClick: React.PropTypes.func,
        className: React.PropTypes.string,
    };

    render() {
        const formatMessage = this.props.intl.formatMessage;

        let classes = cx("Button", this.props.className, {
            "pending": this.props.isPending,
        });

        let label = formatMessage({ id: this.props.labelMsg },
            this.props.labelValues);

        return (
            <button className={ classes }
                onClick={ this.onClick.bind(this) }>
                { label }
            </button>
        );
    }

    onClick(ev) {
        if(!this.props.isPending && this.props.onClick) {
            this.props.onClick(ev);
        }
    }
}
