import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import cx from 'classnames';

export default class ActionBox extends React.Component {
    static propTypes = {
        status: React.PropTypes.string,
        headerMsg: React.PropTypes.string,
        content: React.PropTypes.any,
        footer: React.PropTypes.object,
    };

    render() {

        let classes = cx('ActionBox', this.props.status );

        return (
            <div className={ classes }>
                <div className="ActionBox-header">
                    <Msg id={ this.props.headerMsg }/>
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
