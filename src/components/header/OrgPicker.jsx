import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';


@connect(state => state)
export default class OrgPicker extends React.Component {
    render() {
        let memberships = this.props.memberships;
        let activeOrg = this.props.activeOrg;

        if(memberships.length > 1){
            return (
                <div className="OrgPicker OrgUserMenu-activeOrg">
                    <span className="OrgPicker-label">
                        <Msg id="header.userMenu.switchOrganization"/>
                    </span>
                    <ul className="OrgPicker-list">
                        {memberships.map(function(ms) {
                            if(ms.organization.id === activeOrg.id){
                                return;
                            }

                            let href = '/?org=' + ms.organization.id;

                            return (
                                <li key={ ms.organization.id }
                                    className="OrgPicker-item">
                                    <a href={ href }>{ ms.organization.title }</a>
                                </li>
                            );

                        }, this)}
                    </ul>
                </div>
            );
        }
        else{
            return null;
        }

    }
}
