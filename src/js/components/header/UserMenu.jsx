import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class UserMenu extends FluxComponent {
    componentDidMount() {
        this.listenTo('user', this.forceUpdate);
    }

    render() {
        // TODO: Don't hard-code this
        var accountUrl = 'http://accounts.zetk.in:8000/';

        var userStore = this.getStore('user');
        var userName = userStore.getUserInfo().email;
        var orgName = userStore.getActiveMembership().organization.title;
        var memberships = userStore.getMemberships();

        return (
            <nav className="usermenu">
                <div className="usermenu-info">
                    <span className="usermenu-info-name">{ userName }</span>
                    <span className="usermenu-info-org">{ orgName }</span>
                </div>
                <ul>
                    <li><a href="/logout">Log out</a></li>
                    <li><a href={ accountUrl }>Account settings</a></li>
                    <li className="usermenu-orglabel">Switch organization</li>
                    {memberships.map(function(ms) {
                        return (
                            <li className="usermenu-orgitem"
                                onClick={ this.onOrgClick.bind(this, ms) }>
                                <span className="usermenu-orgitem-title">
                                    { ms.organization.title }</span>
                                <span className="usermenu-orgitem-role">
                                    { ms.role }</span>
                            </li>
                        );
                    }, this)}
                </ul>
            </nav>
        );
    }

    onOrgClick(membership) {
        this.getActions('user').setActiveMembership(membership);
    }
}
