import { injectIntl } from 'react-intl';
import React from 'react';

import cx from 'classnames';

@injectIntl
export default class ActionBox extends React.Component {
    static propTypes = {
        status: React.PropTypes.string,
        header: React.PropTypes.string,
        content: React.PropTypes.object,
        footer: React.PropTypes.object,
    };

    render() {

        let classes = cx('ActionBox', this.props.status );

        return (
            <div className={ classes }>
                <div className="ActionBox-header">
                    { this.props.header }
                </div>
                <div className="ActionBox-content">
                    { this.props.content }
                </div>
                <div className="ActionBox-footer">
                    { this.props.footer }
                </div>
            </div>
        );
    }
}
