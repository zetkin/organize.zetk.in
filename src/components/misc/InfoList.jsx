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
                this.props.data.map(item => {
                    if (!item) {
                        return null;
                    }

                    let className = 'InfoListItem InfoListItem-' + item.name;
                    let value = item.value;

                    // use custom value if set, using the msgId as a fallback
                    if (!value && item.msgId) {
                        value = this.props.intl.formatMessage({ id: item.msgId }, item.msgValues);
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
                        <li className={ className } key={item.name}>
                            {value}
                        </li>
                    );
                })
            }
            </ul>
        );
    }
}
