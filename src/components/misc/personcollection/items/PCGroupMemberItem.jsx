import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class PCGroupMemberItem extends React.Component {
    render() {
        const item = this.props.item;
        const name = item.first_name + ' ' + item.last_name;
        const roleMsg = 'panes.groupMembers.members.roles.' + (item.role || 'none');

        return (
            <div className="PCGroupMemberItem">
                <span className="PCGroupMemberItem-name">
                    { name }</span>
                <span className="PCGroupMemberItem-role">
                    <Msg id={ roleMsg }/></span>
            </div>
        );
    }
}
