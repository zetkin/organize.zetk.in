import React from 'react';
import { connect } from 'react-redux';

import { setActiveMembership } from '../../actions/user';


@connect(state => state)
export default class OrgPicker extends React.Component {
    render() {
        let memberships = this.props.memberships;
        let activeOrg = this.props.activeOrg;

        if(memberships.length > 1){
            return (
                <div className="OrgPicker UserMenu-activeOrg">
                    <span className="OrgPicker-label">
                        Switch organization</span>
                    <ul className="OrgPicker-list">
                        {memberships.map(function(ms) {
                            if(ms.organization.id === activeOrg.id){
                                return
                            }
                            return (
                                <li key={ ms.organization.id }
                                    className="OrgPicker-item"
                                    onClick={ this.onOrgClick.bind(this, ms) }>
                                    { ms.organization.title }
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

    onOrgClick(membership) {
        this.props.dispatch(setActiveMembership(membership));
    }
}
