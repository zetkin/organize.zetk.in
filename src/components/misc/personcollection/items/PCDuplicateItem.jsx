import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class PCDuplicateItem extends React.Component {
    render() {
        const item = this.props.item;
        const name = item.first_name + ' ' + item.last_name;

        return (
            <div className="PCDuplicateItem">
                <span className="PCDuplicateItem-name">
                    { name }</span>
            </div>
        );
    }
}
