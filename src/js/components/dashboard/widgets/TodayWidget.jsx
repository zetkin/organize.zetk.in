import React from 'react/addons';

import WidgetBase from './WidgetBase';


export default class TodayWidget extends WidgetBase {
    renderWidget() {
        return <h1>Today</h1>;
    }
}
