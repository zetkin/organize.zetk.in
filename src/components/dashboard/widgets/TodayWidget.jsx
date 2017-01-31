import React from 'react';


export default class TodayWidget extends React.Component {
    render() {
        let data = this.props.data;

        const tempLabel = Math.round(data.weather.temp) + '°C';
        const weatherIcon = '/static/images/weather/'
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

        return (
            <div className="TodayWidget">
                <div className="TodayWidget-weather">
                    <img src={ weatherIcon }/>
                    <span className="temperature">{ tempLabel }</span>
                    <span className="city">{ data.weather.city }</span>
                </div>,
                <ul className="TodayWidget-stats">
                    <li><span className="TodayWidget-statsLabel">Actions today:</span>
                        <span className="TodayWidget-statsValue">{ actionCount }</span></li>
                    <li><span className="TodayWidget-statsLabel">Locations visited:</span>
                        <span className="TodayWidget-statsValue">{ locationCount }</span></li>
                </ul>
            </div>
        );
    }
}
