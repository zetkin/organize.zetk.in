import React from 'react';
import { injectIntl } from 'react-intl';
import Link from './Link';


@injectIntl
export default class InfoList extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
    }

    render() {
        return (
            <ul className="InfoList">
            {
                this.props.data.map((item, idx) => {
                    let className = 'InfoListItem InfoListItem-' + item.name;
                    let value = item.value;
                    let msgMoreValues = '';

                    // use custom value if set, using the msgId as a fallback
                    if (!value && item.msgId) {
                        let msgValues = item.msgValues ? item.msgValues : {};

                        if(item.msgNumbers) {
                            for(const key in item.msgNumbers) {
                                const msgNumbers = item.msgNumbers[key];

                                msgValues[key] = '';
                                const max = msgNumbers.length > 10 ? 10 : msgNumbers.length;
                                for(let i = 0; i < max; i++) {
                                    if(i > 0) {
                                        msgValues[key] += ', ';
                                    }
                                    msgValues[key] += this.props.intl.formatNumber(msgNumbers[i]);
                                }
                                if(msgNumbers.length > max) {
                                    msgValues[key] += this.props.intl.formatMessage( { id: 'misc.infoList.andMore' }, { number: (msgNumbers.length - max) })
                                }
                            }
                        }
                        value = this.props.intl.formatMessage({ id: item.msgId }, msgValues);
                    }

                    if(!value && item.datetime) {
                        value = this.props.intl.formatDate(item.datetime) + 
                            " " + this.props.intl.formatTime(item.datetime);
                    }

                    if (value && (item.onClick || item.href)) {
                        value = <Link onClick={item.onClick} href={item.href} target={item.target}>
                            {value}
                        </Link>;
                    }

                    if (!value) {
                        value = '-';
                    }

                    return (
                        <li className={ className } key={idx}>
                            {value}
                        </li>
                    );
                })
            }
            </ul>
        );
    }
}
