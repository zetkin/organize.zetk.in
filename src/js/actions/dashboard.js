import http from 'http';
import { Actions } from 'flummox';


export default class DashboardActions extends Actions {
    loadWidgetData(widgetType) {
        return new Promise(function(resolve, reject) {
            const url = '/widgets/' + widgetType;

            // TODO: Replace with https
            http.get(url, function(res) {
                var json = '';
                res.on('data', chunk => json += chunk);
                res.on('end', function() {
                    const data = JSON.parse(json);

                    data.type = widgetType;
                    resolve(data);
                });
            })
            .on('error', function(e) {
                console.log('Failed to load widget data: ' + e.message);
                reject(e);
            });
        });
    }

    moveWidget(moveType, beforeType) {
        return { moveType, beforeType };
    }
}
