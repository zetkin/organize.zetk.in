import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

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
            <InviteBox/>
        ];

        if (inviteList.isPending) {
            content.push(<LoadingIndicator/>);
        }
        else {
            let invites = inviteList.items.map(i => i.data);

            content.push(
                <Msg tagName="h2" id="panes.invite.sentHeader"/>,
                <div className="InvitePane-invites">
                    <ul className="InvitePane-inviteList">
                    { invites.map(i => {

                        const classes = cx({
                            'InvitePane-invite': true,
                            'consumed': i.is_consumed
                        });
                        return (
                            <li key={ i.id } className={ classes }>
                                <span className="InvitePane-time">
                                    { i.invite_time }</span>
                                <span className="InvitePane-email">
                                    { i.invite_email }</span>
                                <span className="InvitePane-official">
                                    { i.official.name }</span>
                            </li>
                        );
                    }) }
                    </ul>
                </div>
            );
        }

        return content;
    }
}
