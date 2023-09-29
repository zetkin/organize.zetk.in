import React from 'react';
import url from 'url';


export default class LocationListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.any.isRequired,
            title: React.PropTypes.string.isRequired,
            lat: React.PropTypes.number.isRequired,
            lng: React.PropTypes.number.isRequired
        }).isRequired
    };

    render() {
        const loc = this.props.data;

        return (
            <div className="LocationListItem"
                onClick={ this.props.onItemClick }>
                <h3 className="LocationListItem-title">
                    { loc.title }</h3>
            </div>
        );
    }
}
