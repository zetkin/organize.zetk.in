import React from 'react';


export default class PersonFieldListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            title: React.PropTypes.string.isRequired,
        })
    }

    render() {
        let field = this.props.data;

        return (
            <div className="PersonFieldListItem"
                onClick={ this.props.onItemClick }>

                <div className="PersonFieldListItem-col">
                    <span className="PersonFieldListItem-title">
                        { field.title }</span>
                    <span className="PersonFieldListItem-description">
                        { field.description }</span>
                </div>
            </div>
        );
    }
}
