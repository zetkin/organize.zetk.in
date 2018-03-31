import React from 'react';


export default class PersonTagListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            title: React.PropTypes.string.isRequired,
        })
    }

    render() {
        let tag = this.props.data;

        return (
            <div className="PersonTagListItem"
                onClick={ this.props.onItemClick }>

                <div className="PersonTagListItem-col">
                    <span className="PersonTagListItem-title">
                        { tag.title }</span>
                    <span className="PersonTagListItem-description">
                        { tag.description }</span>
                </div>
            </div>
        );
    }
}
