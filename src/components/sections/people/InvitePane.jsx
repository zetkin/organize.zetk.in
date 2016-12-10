import React from 'react';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import Button from '../../misc/Button';
import InviteBox from '../../misc/InviteBox';
import LoadingIndicator from '../../misc/LoadingIndicator';
import PaneBase from '../../panes/PaneBase';
import { retrieveInvites } from '../../../actions/invite';


@connect(state => ({ invites: state.invites }))
export default class InvitePane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveInvites());
    }

    renderPaneContent(data) {
        let inviteList = this.props.invites.inviteList;

        let content = [
            <InviteBox key="inviteBox"/>
        ];

        if (inviteList.isPending) {
            content.push(<LoadingIndicator key="loadingIndicator"/>);
        }
        else {
            let invites = inviteList.items.map(i => i.data);

            content.push(
                <Msg key="sentHeader"
                    tagName="h2" id="panes.invite.sentHeader"/>,
                <table key="table" className="InvitePane-invites">
                    <thead>
                        <tr>
                            <th/>
                            <Msg tagName="th"
                                id="panes.invite.table.header.sent"/>
                            <Msg tagName="th"
                                id="panes.invite.table.header.email"/>
                            <Msg tagName="th"
                                id="panes.invite.table.header.official"/>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                    { invites.map(i => {

                        let inviteTime = new Date(i.invite_time);

                        const classes = cx({
                            'InvitePane-invite': true,
                            'consumed': i.is_consumed
                        });
                        return (
                            <tr key={ i.id } className={ classes }>
                                <td className="InvitePane-consumed"></td>
                                <td className="InvitePane-time">
                                    <FormattedDate value={ inviteTime } /></td>
                                <td className="InvitePane-email">
                                    { i.invite_email }</td>
                                <td className="InvitePane-official">
                                    { i.official.name }</td>
                                <td className="InvitePane-remove">
                                    <Button key="removeButton"
                                        labelMsg="panes.invite.table.removeButton"
                                        onClick={ this.onClickRemove.bind(this) }/>
                                </td>
                            </tr>
                        );
                    }) }
                    </tbody>
                </table>
            );
        }

        return content;
    }

    onClickRemove() {
        return null;
    }
}
