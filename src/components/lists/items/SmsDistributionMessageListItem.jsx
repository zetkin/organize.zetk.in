import React, { PropTypes } from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import DraggableAvatar from '../../misc/DraggableAvatar';

export default class SmsDistributionMessageListItem extends React.Component {
    static propTypes = {
        onItemClick: PropTypes.func,
        data: PropTypes.shape({
            id: PropTypes.number.isRequired,
            target: PropTypes.shape({
                id: PropTypes.number.isRequired,
                first_name: PropTypes.string.isRequired,
                last_name: PropTypes.string.isRequired,
                phone: PropTypes.string,
                alt_phone: PropTypes.string,
            }).isRequired,
            phone: PropTypes.string,
            status: PropTypes.oneOf([
                'draft',
                'confirm',
                'created',
                'sent',
                'delivered',
                'error',
            ]).isRequired,
            error_code: PropTypes.string,
        })
    }

    render() {
        const {
            target: {
                id: target_id,
                first_name,
                last_name,
            },
            phone,
            error_code,
        } = this.props.data;

        return (
            <div className="SmsDistributionMessageListItem"
                onClick={this.props.onItemClick}>

                <DraggableAvatar person={{
                    id: target_id,
                    first_name,
                    last_name,
                }} />
                <div className="SmsDistributionMessageListItem-col">
                    <span className="SmsDistributionMessageListItem-firstName">
                        {first_name}</span>
                    <span className="SmsDistributionMessageListItem-lastName">
                        {last_name}</span>
                </div>
                <div className="SmsDistributionMessageListItem-col">
                    <span className="SmsDistributionMessageListItem-phone">
                        {phone}</span>
                </div>

                {error_code && (
                    <div className="SmsDistributionMessageListItem-error">
                        <Msg id={'lists.smsDistributionMessageList.error.' + error_code}
                        />
                    </div>
                )}
            </div>
        );
    }
}

