import React from 'react/addons';

import FluxComponent from '../FluxComponent';

export default class OrgPicker extends FluxComponent {
    render() {
        let memberships = this.props.memberships;
        let activeOrg = this.props.activeOrg;

        if(memberships.length > 1){
            return (
                <div className="orgpicker">
                    <span className="orgpicker-label">
                        Switch organization</span>
                    <ul className="orgpicker-list">
                        {memberships.map(function(ms) {
                            if(ms.organization.id === activeOrg.id){
                                return
                            }
                            return (
                                <li key={ ms.organization.id }
                                    className="orgpicker-item"
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
        this.getActions('user').setActiveMembership(membership);
    }
}
