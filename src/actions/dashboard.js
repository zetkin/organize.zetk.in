import http from 'http';
import * as types from '.';


export function loadWidgetData(widgetType) {
    let promise = new Promise(function(resolve, reject) {
        const url = '/widgets/' + widgetType;

        // TODO: Replace with https
        http.get(url, function(res) {
            var json = '';
            res.on('data', chunk => json += chunk);
            res.on('end', function() {
                const data = JSON.parse(json);

                data.id = widgetType;
                resolve(data);
            });
        })
        .on('error', function(e) {
            console.log('Failed to load widget data: ' + e.message);
            reject(e);
        });
    });

    return {
        type: types.LOAD_WIDGET_DATA,
        meta: { widgetType },
        payload: { promise },
    }
}

export function moveWidget(moveType, beforeType) {
    return {
        type: types.MOVE_WIDGET,
        payload: { moveType, beforeType },
    }
}
