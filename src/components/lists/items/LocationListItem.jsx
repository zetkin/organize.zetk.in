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
                size: '120x90',
                key: 'AIzaSyAHVagqI3RTd0psf57oA6gzKqVyjp8FS8w',
            }
        });

        return (
            <div className="LocationListItem"
                onClick={ this.props.onItemClick }>
                <img src={ imgSrc }/>
                <span className="LocationListItem-title">
                    { loc.title }</span>
            </div>
        );
    }
}
