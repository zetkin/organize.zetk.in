import { connect } from 'react-redux';
import React from 'react';

import PaneBase from '../../panes/PaneBase';


@connect(state => ({ officials: state.officials }))
export default class OfficialsPane extends PaneBase {
    renderPaneContent() {
        return [
            <h1>Administrators</h1>,
            <p>{
                "Administrators have full access to all aspects of the " +
                "organization."
            }</p>,
            <h1>Organizers</h1>,
            <p>{
                "Organizers have enough access to perform the day-to-day " +
                "tasks related to, for example, managing a running campaign " +
                "or an active call assignment."
            }</p>
        ];
    }
}
