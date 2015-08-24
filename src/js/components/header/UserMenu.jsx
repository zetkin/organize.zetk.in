import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import OrgPicker from './OrgPicker';


export default class UserMenu extends FluxComponent {
    componentDidMount() {
        this.listenTo('user', this.forceUpdate);
    }

    render() {
        // TODO: Don't hard-code this
        var accountUrl = 'http://accounts.zetk.in:8000/';

        var userStore = this.getStore('user');
        var userName = userStore.getUserInfo().email;
        var activeOrg = userStore.getActiveMembership().organization;
        var memberships = userStore.getMemberships();

        return (
            <nav className="usermenu">
                <div className="usermenu-avatar"></div>
                <div className="usermenu-info">
                    <div className="usermenu-user">
                        <a href={ accountUrl }><span className="usermenu-info-name">{ userName }</span></a>
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
