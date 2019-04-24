import React from 'react';
import { injectIntl } from 'react-intl';
import { split as splitter } from 'split-sms';

import InputBase from './InputBase';
import InfoList from '../../misc/InfoList';


@injectIntl
export default class SmsMessageInput extends InputBase {
    renderInput() {
        const {
            name,
            value
        } = this.props;

        const {
            characterSet,
            parts: {
                length: partCount,
            },
            length,
            remainingInPart,
        } = splitter(value);

        return (
            <div className="SmsMessageInput">
                <textarea name={name} value={value}
                    onChange={this.onChange.bind(this)} />
                <InfoList data={[{
                    name: 'partCount',
                    msgId: 'forms.smsDistribution.messageInput.partCount',
                    msgValues: { partCount },
                }, {
                    name: 'length',
                    msgId: 'forms.smsDistribution.messageInput.length',
                    msgValues: { length },
                }, {
                    name: 'remainingInPart',
                    msgId: 'forms.smsDistribution.messageInput.remainingInPart',
                    msgValues: { remainingInPart },
                }, (characterSet === 'Unicode' && partCount > 1 && {
                    name: 'unicodeWarning',
                    msgId: 'forms.smsDistribution.messageInput.unicodeWarning',
                })]} />
            </div>
        );
    }
}
