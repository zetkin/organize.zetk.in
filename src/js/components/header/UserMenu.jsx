import React from 'react';

import FluxComponent from '../FluxComponent';
import OrgPicker from './OrgPicker';
import Avatar from '../misc/Avatar';


export default class UserMenu extends FluxComponent {
    componentDidMount() {
        this.listenTo('user', this.forceUpdate);
    }

    render() {
        var userStore = this.getStore('user');

        var accountUrl = '//' + userStore.getAccountsHost();

        const membership = userStore.getActiveMembership();
        const activeOrg = membership.organization;
        const profile = membership.profile;
        const memberships = userStore.getMemberships();

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
                        <li><a href="/logout">Log out</a></li>
                        <li><a href={ accountUrl }>Account settings</a></li>
                        <li>< OrgPicker memberships={ memberships } activeOrg={ activeOrg }/></li>
                    </ul>
                </div>
            </nav>
        );
    }
}
