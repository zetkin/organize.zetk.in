import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

@connect(() => ({}))
export default class SmsDistributionListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let distribution = this.props.data;

        const classNames = cx({
            'SmsDistributionListItem': true,
        });

        return (
            <div className={ classNames } onClick={ this.props.onItemClick }>
                <div className="SmsDistributionListItem-info">
                    <h3 className="SmsDistributionListItem-infoTitle">
                        { distribution.title }
                    </h3>
                </div>
            </div>
        );
    }
}
