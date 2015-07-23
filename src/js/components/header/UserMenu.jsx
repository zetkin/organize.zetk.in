import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class UserMenu extends FluxComponent {
    render() {
        // TODO: Don't hard-code this
        var accountUrl = 'http://accounts.zetk.in:8000/';

        var userStore = this.getStore('user');
        var userName = userStore.getUserInfo().email;
        var orgName = 'Some org'; // TODO: Selected organization

        return (
            <nav className="user-menu">
                <div className="user-info">
                    <span className="user-name">{ userName }</span>
                    <span className="user-org">{ orgName }</span>
                </div>
                <ul>
                    <li><a href="/logout">Log out</a></li>
                    <li><a href={ accountUrl }>Account settings</a></li>
                    <li>Switch organization</li>
                </ul>
            </nav>
        );
    }
}
