import React from 'react';


export default class OrganizationCloudItem extends React.Component {
    static propTypes = {
        onEdit: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        showEditButton: React.PropTypes.bool,
        showRemoveButton: React.PropTypes.bool,
        organization: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired, // TODO: Replace with string
            title: React.PropTypes.string.isRequired,
        }).isRequired,
    };

    render() {
        let organization = this.props.organization;

        let editButton = null;
        if (this.props.showEditButton) {
            editButton = (
                <a className="OrganizationCloudItem-editButton"
                    onClick={ this.onEdit.bind(this, organization) }></a>
            );
        }

        let removeButton = null;
        if (this.props.showRemoveButton) {
            removeButton = (
                <a className="OrganizationCloudItem-removeButton"
                    onClick={ this.onRemove.bind(this, organization) }></a>
            );
        }

        return (
            <li className="OrganizationCloudItem"
                title={ organization.description }>
                <span className="OrganizationCloudItem-title"
                    onClick={ this.onSelect.bind(this, organization) }>
                        { organization.title }</span>
                { editButton }
                { removeButton }
            </li>
        );
    }

    onSelect(organization) {
        if (this.props.onSelect) {
            this.props.onSelect(organization);
        }
    }

    onEdit(organization) {
        if (this.props.onEdit) {
            this.props.onEdit(organization);
        }
    }

    onRemove(organization) {
        if (this.props.onRemove) {
            this.props.onRemove(organization);
        }
    }
}
