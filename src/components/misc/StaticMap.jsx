import React from 'react';
import url from 'url';

import { convertLatToDMS, convertLngToDMS } from '../../utils/location';


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

        // Convert lat/lng to degrees, minutes and seconds, which is more
        // readable than the decimal value with tons of decimals.
        let latDMS = convertLatToDMS(lat), lngDMS = convertLngToDMS(lng);
        let latStr = latDMS.deg.toString()
            .concat('° ', latDMS.min, '\' ', latDMS.sec, '" ', latDMS.dir);
        let lngStr = lngDMS.deg.toString()
            .concat('° ', lngDMS.min, '\' ', lngDMS.sec, '" ', lngDMS.dir);

        return (
            <div className="StaticMap"
                onClick={ this.onClick.bind(this) }>
                <img src={ imgSrc }/>
                <div className="StaticMap-coordinates">
                    <span className="StaticMap-lat">{ latStr }</span>
                    <span className="StaticMap-lng">{ lngStr }</span>
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
