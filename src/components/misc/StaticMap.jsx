import React from 'react';
import url from 'url';
import { FormattedMessage as Msg } from 'react-intl';

import { convertLatToDMS, convertLngToDMS } from '../../utils/location';


export default class StaticMap extends React.Component {
    static propTypes = {
        location: React.PropTypes.object,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
    };

    static defaultProps = {
        width: 480,
        height: 200,
    };

    render() {
        let loc = this.props.location;
        let map = null;
        let coordinates = null;

        if (loc) {
            let lat = loc.lat;
            let lng = loc.lng;

            // Static maps disabled because no simple reliable options and this code will soon be discontinued.
            // For now only show the coordinates.

            // Convert lat/lng to degrees, minutes and seconds, which is more
            // readable than the decimal value with tons of decimals.
            let latDMS = convertLatToDMS(lat), lngDMS = convertLngToDMS(lng);
            let latStr = latDMS.deg.toString()
                .concat('° ', latDMS.min, '\' ', latDMS.sec, '" ', latDMS.dir);
            let lngStr = lngDMS.deg.toString()
                .concat('° ', lngDMS.min, '\' ', lngDMS.sec, '" ', lngDMS.dir);

            coordinates = (
                <div className="StaticMap-coordinates">
                    <span className="StaticMap-lat">{ latStr }</span>
                    <span className="StaticMap-lng">{ lngStr }</span>
                </div>
            );
        }
        else {
            coordinates = (
                <div className="StaticMap-coordinates">
                    <Msg id="misc.staticMap.noCoordinates"/>
                </div>
            );
        }

        return (
            <div className="StaticMap"
                onClick={ this.onClick.bind(this) }>
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
