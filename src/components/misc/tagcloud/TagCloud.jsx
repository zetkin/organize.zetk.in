import React from 'react';

import TagCloudItem from './TagCloudItem';


export default class TagCloud extends React.Component {
    static propTypes = {
        tags: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        onAdd: React.PropTypes.func,
        showAddButton: React.PropTypes.bool,
        showRemoveButtons: React.PropTypes.bool,
    };

    static defaultProps = {
        showAddButton: false,
        showRemoveButtons: false,
    };

    render() {
        let addButton = null;
        if (this.props.showAddButton) {
            addButton = (
                <li className="TagCloud-addButton">
                    <a onClick={ this.props.onAdd }>
                        Add tag</a>
                </li>
            );
        }

        return (
            <ul className="TagCloud">
            { this.props.tags.map(tag => (
                <TagCloudItem key={ tag.id } tag={ tag }
                    showRemoveButton={ this.props.showRemoveButtons }
                    onSelect={ this.props.onSelect }
                    onRemove={ this.props.onRemove }/>
            )) }
                { addButton }
            </ul>
        );
    }
}
