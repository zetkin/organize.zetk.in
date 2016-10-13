import React from 'react';
import { connect } from 'react-redux';

import Link from '../misc/Link';
import OrgPicker from './OrgPicker';
import Avatar from '../misc/Avatar';


@connect(state => state)
export default class UserMenu extends React.Component {
    render() {
        let userStore = this.props.user;

        var accountUrl = '//account.' + process.env.ZETKIN_DOMAIN;

        const membership = userStore.activeMembership;
        const activeOrg = membership.organization;
        const profile = membership.profile;
        const memberships = userStore.memberships;

        return (
            <nav className="UserMenu">
                <Avatar person={ profile }/>
                <div className="UserMenu-info">
                    <div className="UserMenu-user">
                        <a href={ accountUrl }>
                            <span className="UserMenu-name">
                                { profile.name }
                            </span>
                        </a>
                        <span className="UserMenu-org">{ activeOrg.title }</span>
                    </div>
                    <ul>
                        <li>
                            <Link className="UserMenu-logout"
                                href="/logout"
                                msgId="header.userMenu.logOutLink"/>
                        </li>
                        <li>
                            <Link className="UserMenu-account"
                                href={ accountUrl }
                                msgId="header.userMenu.accountLink"/>
                        </li>
                        <li>
                            <OrgPicker memberships={ memberships }
                                activeOrg={ activeOrg }/>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
