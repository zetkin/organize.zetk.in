import React from 'react';
import url from 'url';


export default class StaticMap extends React.Component {
    static propTypes = {
        location: React.PropTypes.object.isRequired,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
    };

    static defaultProps = {
        width: 480,
        height: 200,
    };

    render() {
        let loc = this.props.location;
        let lat = loc.lat;
        let lng = loc.lng;

        const imgSrc = url.format({
            protocol: 'https',
            hostname: 'maps.googleapis.com',
            pathname: '/maps/api/staticmap',
            query: {
                center: (lat + 0.0002) + ',' + lng,
                markers: lat + ',' + lng,
                zoom: 17,
                size: this.props.width + 'x' + this.props.height,
                key: 'AIzaSyAHVagqI3RTd0psf57oA6gzKqVyjp8FS8w',
            }
        });

        return (
            <div className="StaticMap"
                onClick={ this.onClick.bind(this) }>
                <img src={ imgSrc }/>
                <div className="StaticMap-coordinates">
                    <span className="StaticMap-lat">{ loc.lat }</span>
                    <span className="StaticMap-lng">{ loc.lng }</span>
                </div>
            </div>
        );
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.location);
        }
    }
}
