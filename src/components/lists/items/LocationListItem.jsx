import React from 'react';
import url from 'url';


export default class LocationListItem extends React.Component {
    render() {
        const loc = this.props.data;
        const lat = loc.lat;
        const lng = loc.lng;

        const imgSrc = url.format({
            protocol: 'https',
            hostname: 'maps.googleapis.com',
            pathname: '/maps/api/staticmap',
            query: {
                center: (lat + 0.0002) + ',' + lng,
                markers: lat + ',' + lng,
                zoom: 15,
                size: '120x90'
            }
        });

        return (
            <div className="LocationListItem"
                onClick={ this.onClick.bind(this) }>
                <img src={ imgSrc }/>
                <span className="LocationListItem-title">
                    { loc.title }</span>
            </div>
        );
    }

    onClick() {
        if (this.props.onItemClick) {
            this.props.onItemClick(this.props.location);
        }
    }
}

LocationListItem.propTypes = {
    onItemClick: React.PropTypes.func,
    location: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        lat: React.PropTypes.number.isRequired,
        lng: React.PropTypes.number.isRequired
    }).isRequired
};
