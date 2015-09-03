import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import OrgPicker from './OrgPicker';


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
            <nav className="usermenu">
                <div className="usermenu-avatar"></div>
                <div className="usermenu-info">
                    <div className="usermenu-user">
                        <a href={ accountUrl }>
                            <span className="usermenu-info-name">
                                { profile.name }
                            </span>
                        </a>
                        <span className="usermenu-info-org">{ activeOrg.title }</span>
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
