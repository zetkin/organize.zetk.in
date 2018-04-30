import React from 'react';
import { connect } from 'react-redux';

import Link from '../misc/Link';
import OrgPicker from './OrgPicker';
import Avatar from '../misc/Avatar';


const mapStateToProps = (state, props) => ({
    membership: state.user.activeMembership,
    activeOrg: state.user.activeMembership.organization,
    profile: state.user.activeMembership.profile,
    memberships: state.user.memberships,
});

@connect(mapStateToProps)
export default class OrgUserMenu extends React.Component {
    render() {
        const wwwUrl =  '//www.' + process.env.ZETKIN_DOMAIN;
        const myPageUrl = wwwUrl + '/dashboard';
        const settingsUrl = wwwUrl + '/settings';

        const { activeOrg,
                profile,
                memberships } = this.props;

        return (
            <nav className="OrgUserMenu">
                <Avatar person={ profile }/>
                <div className="OrgUserMenu-info">
                    <div className="OrgUserMenu-user">
                        <a href={ myPageUrl }>
                            <span className="OrgUserMenu-name">
                                { profile.name }
                            </span>
                        </a>
                        <span className="OrgUserMenu-org">{ activeOrg.title }</span>
                    </div>
                    <ul>
                        <li>
                            <Link className="OrgUserMenu-myPage"
                                href={ myPageUrl }
                                msgId="header.userMenu.myPageLink"/>
                        </li>
                        <li>
                            <Link className="OrgUserMenu-account"
                                href={ settingsUrl }
                                msgId="header.userMenu.accountLink"/>
                        </li>
                        <li>
                            <Link className="OrgUserMenu-logout"
                                href="/logout"
                                msgId="header.userMenu.logOutLink"/>
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
