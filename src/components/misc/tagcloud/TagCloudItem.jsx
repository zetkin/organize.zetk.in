import React from 'react';


export default class TagCloudItem extends React.Component {
    static propTypes = {
        onRemove: React.PropTypes.func,
        showRemoveButton: React.PropTypes.bool,
        tag: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired, // TODO: Replace with string
            title: React.PropTypes.string.isRequired,
        }).isRequired,
    };

    render() {
        let tag = this.props.tag;

        let removeButton = null;
        if (this.props.showRemoveButton) {
            removeButton = (
                <a className="TagCloudItem-removeButton"
                    onClick={ this.onRemove.bind(this, tag) }>x</a>
            );
        }

        return (
            <li className="TagCloudItem">
                <span className="TagCloudItem-title"
                    onClick={ this.onSelect.bind(this, tag) }>
                        { tag.title }</span>
                { removeButton }
            </li>
        );
    }

    onSelect(tag) {
        if (this.props.onSelect) {
            this.props.onSelect(tag);
        }
    }

    onRemove(tag) {
        if (this.props.onRemove) {
            this.props.onRemove(tag);
        }
    }
}
