import React from 'react';

import TagCloudItem from './TagCloudItem';


export default class TagCloud extends React.Component {
    static propTypes = {
        tags: React.PropTypes.array.isRequired,
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
                <li className="TagCloud-addButton"
                    onClick={ this.props.onAdd }>
                    Add
                </li>
            );
        }

        return (
            <ul className="TagCloud">
            { this.props.tags.map(tag => (
                <TagCloudItem key={ tag.id } tag={ tag }
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
