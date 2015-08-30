import React from 'react/addons';
import moment from 'moment';

import PaneBase from './PaneBase';
import ActionList from '../misc/actionlist/ActionList';


export default class EditActionPane extends PaneBase {
    componentDidMount() {
        this.listenTo('action', this.forceUpdate);
    }

    getPaneTitle(data) {
        const d = moment(this.getParam(0));

        return 'Actions on ' + d.format('YYYY-MM-DD');
    }

    renderPaneContent(data) {
        const date = moment(this.getParam(0));
        const actionStore = this.getStore('action');
        const actions = actionStore.getActions().filter(a =>
            moment(a.start_time).isSame(date, 'day'));

        return (
            <ActionList actions={ actions }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        var values = this.refs.form.getChangedValues();
        var actionId = this.props.params[0];

        this.getActions('action').updateAction(actionId, values);
    }

    onCreateCampaign(title) {
        this.gotoSubPane('addcampaign', title);
    }

    onCreateLocation(title) {
        this.gotoSubPane('addlocation', title);
    }

    onCreateActivity(title) {
        this.gotoSubPane('addactivity', title);
    }
}
