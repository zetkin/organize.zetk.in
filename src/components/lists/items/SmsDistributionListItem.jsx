import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

@connect(() => ({}))
export default class SmsDistributionListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        const {
            title,
            state,
            sent,
        } = this.props.data;

        return (
            <div className="SmsDistributionListItem"
                onClick={this.props.onItemClick}>
                <div className="SmsDistributionListItem-title">
                    {title}
                </div>
                <div className="SmsDistributionListItem-sent">
                    {sent && (
                        Date
                            .create(sent, { fromUTC: true })
                            .format('{yyyy}-{MM}-{dd} {HH}:{mm}')
                    )}
                </div>
                <div className={cx(
                    'SmsDistributionListItem-state',
                    `SmsDistributionListItem-state--${state}`,
                )}>
                    <Msg id={`lists.smsDistributionList.item.state.${state}`} />
                </div>
            </div>
        );
    }
}
