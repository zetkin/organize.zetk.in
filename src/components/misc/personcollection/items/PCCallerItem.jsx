import React from 'react';


export default class PersonCollectionCallerItem extends React.Component {
    static propTypes = {
        item: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired, // TODO: Use string
            first_name: React.PropTypes.string.isRequired,
            last_name: React.PropTypes.string.isRequired,
            prioritized_tags: React.PropTypes.array.isRequired,
            excluded_tags: React.PropTypes.array.isRequired,
        }).isRequired
    };

    render() {
        let item = this.props.item;
        let name = item.first_name + ' ' + item.last_name;

        return (
            <div className="PersonCollectionCallerItem">
                <span className="PersonCollectionCallerItem-name">
                    { name }</span>
                <ul className="PersonCollectionCallerItem-tags">
                    <li><i className="fa fa-star"></i>
                        { item.prioritized_tags.length }</li>
                    <li><i className="fa fa-ban"></i>
                        { item.excluded_tags.length }</li>
                </ul>
            </div>
        );
    }
}
