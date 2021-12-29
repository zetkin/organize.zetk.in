import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import OrganizationCloudItem from './OrganizationCloudItem';


export default class OrganizationCloud extends React.Component {
    static propTypes = {
        organizations: React.PropTypes.array.isRequired,
        onAdd: React.PropTypes.func,
        onEdit: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        showAddButton: React.PropTypes.bool,
        showEditButtons: React.PropTypes.bool,
        showRemoveButtons: React.PropTypes.bool,
    };

    static defaultProps = {
        showAddButton: false,
        showEditButtons: false,
        showRemoveButtons: false,
    };

    render() {
        let addButton = null;
        if (this.props.showAddButton) {
            addButton = (
                <li className="OrganizationCloud-addButton"
                    onClick={ this.props.onAdd }>
                    <Msg id="misc.organizationCloud.addButton"/>
                </li>
            );
        }

        return (
            <ul className="OrganizationCloud">
            { this.props.organizations.map(org => (
                <OrganizationCloudItem key={ org.id } organization={ org }
                    showEditButton={ this.props.showEditButtons }
                    showRemoveButton={ this.props.showRemoveButtons }
                    onEdit={ this.props.onEdit }
                    onSelect={ this.props.onSelect }
                    onRemove={ this.props.onRemove }/>
            )) }
                { addButton }
            </ul>
        );
    }
}
