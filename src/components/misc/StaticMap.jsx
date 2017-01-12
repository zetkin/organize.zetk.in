import React from 'react';
import url from 'url';
import { FormattedMessage as Msg } from 'react-intl';

import { convertLatToDMS, convertLngToDMS } from '../../utils/location';


export default class StaticMap extends React.Component {
    static propTypes = {
        location: React.PropTypes.object.isRequired,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        placeholder: React.PropTypes.bool
    };

    static defaultProps = {
        width: 480,
        height: 200,
    };

    render() {
        let placeholder = this.props.placeholder;
        let map = null;
        let coordinates = null;

        if (placeholder) {
            map = (
                 <div className="StaticMap-placeholder">
                    <Msg id="panes.addLocation.setPositionLink"/>
                </div>
            );

            coordinates = (
                <div className="StaticMap-coordinates">
                    <Msg id="panes.addLocation.noCoordinates"/>
                </div>
            );
        }
        else {
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

            map = (
                <img src={ imgSrc }/>
            );

            coordinates = (
                <div className="StaticMap-coordinates">
                    <span className="StaticMap-lat">{ latStr }</span>
                    <span className="StaticMap-lng">{ lngStr }</span>
                </div>
            );
        }

        return (
            <div className="StaticMap"
                onClick={ this.onClick.bind(this) }>
                { map }
                { coordinates }
            </div>
        );
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.location);
        }
    }
}
