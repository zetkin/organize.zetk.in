import React from 'react';

import WidgetBase from './WidgetBase';


export default class TodayWidget extends WidgetBase {
    renderWidget(data) {
        const tempLabel = Math.round(data.weather.temp) + '°C';
        const weatherIcon = '/static/img/weather/'
            .concat(data.weather.forecast.icon + '.png');

        const locations = {};
        for (let i = 0; i < data.actions.length; i++) {
            let action = data.actions[i];
            let locationId = action.location.id;
            if (!locations.hasOwnProperty(locationId)) {
                locations[locationId] = action.location;
            }
        }

        const locationCount = Object.keys(locations).length;
        const actionCount = data.actions.length;

        return [
            <div className="weather">
                <img src={ weatherIcon }/>
                <span className="temperature">{ tempLabel }</span>
                <span className="city">{ data.weather.city }</span>
            </div>,
            <ul className="stats">
                <li><span className="label">Actions today:</span>
                    <span className="value">{ actionCount }</span></li>
                <li><span className="label">Locations visited:</span>
                    <span className="value">{ locationCount }</span></li>
            </ul>
        ];
    }
}
