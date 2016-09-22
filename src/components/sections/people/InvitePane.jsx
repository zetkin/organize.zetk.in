import React from 'react';
import { connect } from 'react-redux';

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

        if (inviteList.isPending) {
            return <LoadingIndicator/>;
        }
        else {
            let invites = inviteList.items.map(i => i.data);

            return (
                <ul className="InvitePane-invites">
                { invites.map(i => {
                    return (
                        <li key={ i.id } className="InvitePane-invite">
                            <span className="InvitePane-time">
                                { i.invite_time }</span>
                            <span className="InvitePane-email">
                                { i.email }</span>
                            <span className="InvitePane-official">
                                { i.official.name }</span>
                        </li>
                    );
                }) }
                </ul>
            );
        }
    }
}
