import React from 'react';


export default class TagCloudItem extends React.Component {
    static propTypes = {
        onEdit: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        showEditButton: React.PropTypes.bool,
        showRemoveButton: React.PropTypes.bool,
        tag: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired, // TODO: Replace with string
            title: React.PropTypes.string.isRequired,
        }).isRequired,
    };

    render() {
        let tag = this.props.tag;

        let editButton = null;
        if (this.props.showEditButton) {
            editButton = (
                <a className="TagCloudItem-editButton"
                    onClick={ this.onEdit.bind(this, tag) }></a>
            );
        }

        let removeButton = null;
        if (this.props.showRemoveButton) {
            removeButton = (
                <a className="TagCloudItem-removeButton"
                    onClick={ this.onRemove.bind(this, tag) }></a>
            );
        }

        return (
            <li className="TagCloudItem"
                title={ tag.description }>
                <span className="TagCloudItem-title"
                    onClick={ this.onSelect.bind(this, tag) }>
                        { tag.title }</span>
                { editButton }
                { removeButton }
            </li>
        );
    }

    onSelect(tag) {
        if (this.props.onSelect) {
            this.props.onSelect(tag);
        }
    }

    onEdit(tag) {
        if (this.props.onEdit) {
            this.props.onEdit(tag);
        }
    }

    onRemove(tag) {
        if (this.props.onRemove) {
            this.props.onRemove(tag);
        }
    }
}
