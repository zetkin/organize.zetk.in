import React from 'react/addons';
import url from 'url';

import MatchBase from './MatchBase';


export default class LocationMatch extends MatchBase {
    getTitle() {
        return this.props.data.title;
    }

    getImage() {
        var lat = this.props.data.lat;
        var lng = this.props.data.lng;

        var imgSrc = url.format({
            protocol: 'https',
            hostname: 'maps.googleapis.com',
            pathname: '/maps/api/staticmap',
            query: {
                center: (lat + 0.004) + ',' + lng,
                markers: lat + ',' + lng,
                zoom: 11,
                size: '50x50'
            }
        });

        return <img src={ imgSrc }/>
    }
}
