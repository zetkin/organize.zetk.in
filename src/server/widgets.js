import express from 'express';
import http from 'http';

const widgets = express.Router();

widgets.get('/action_response', function(req, res) {
    res.send('{}');
});

widgets.get('/organizer_notes', function(req, res) {
    res.send('{}');
});

widgets.get('/today', function(req, res) {
    let orgId = req.store.getState().org.activeId;

    const weatherPromise = new Promise(function(resolve, reject) {
        // TODO: Don't hardcode to Malmo
        const lat = 55.5919;
        const lng = 13.0070;
        const url = 'http://api.openweathermap.org/data/2.5/forecast/daily'
            .concat('?lat=' + lat)
            .concat('&lon=' + lng)
            .concat('&APPID=' + process.env.OPENWEATHERMAP_APIKEY)
            .concat('&cnt=1&units=metric');

        http.get(url, function(res) {
            var json = '';
            res.on('data', chunk => json += chunk);
            res.on('end', function() {
                const data = JSON.parse(json);
                resolve(data);
            });
        });
    });

    Promise.all([
        weatherPromise,
        req.z.resource('orgs', orgId, 'actions').get()
    ]).then(function(results) {
        const weather = results[0];
        const actions = results[1].data.data;
        const data = {};

        // TODO: Filter using API instead
        data.actions = actions.filter(a =>
            new Date(a.start_time).is('today'));

        data.weather = {
            city: weather.city.name,
            temp: weather.list[0].temp.day,
            forecast: weather.list[0].weather[0]
        };

        res.json(data);
    });
});

widgets.get('/upcoming_actions', function(req, res) {
    res.send('{}');
});

export default widgets;
