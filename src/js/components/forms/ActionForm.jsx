import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import Form from './Form';
import DateInput from './inputs/DateInput';
import TextArea from './inputs/TextArea';
import TimeInput from './inputs/TimeInput';
import RelSelectInput from './inputs/RelSelectInput';


export default class ActionForm extends FluxComponent {
    componentDidMount() {
        this.listenTo('activity', this.forceUpdate);
        this.listenTo('location', this.forceUpdate);
        this.listenTo('campaign', this.forceUpdate);
        this.getActions('activity').retrieveActivities();
        this.getActions('location').retrieveLocations();
        this.getActions('campaign').retrieveCampaigns();
    }

    render() {
        const action = this.props.action || {
            campaign: {},
            location: {},
            activity: {}
        };

        const campaigns = this.getStore('campaign').getCampaigns();
        const locations = this.getStore('location').getLocations();
        const activities = this.getStore('activity').getActivities();

        const date = action.start_time? new Date(action.start_time) : undefined;
        const startTime = date? formatTime(date) : undefined;
        const endTime = action.end_time?
            formatTime(new Date(action.end_time)) : undefined;

        return (
            <Form ref="form" {...this.props }>
                <RelSelectInput label="Campaign" name="campaign_id"
                    objects={ campaigns }
                    initialValue={ action.campaign.id }/>
                <DateInput label="Date" name="date"
                    initialValue={ date }/>
                <TimeInput label="Start" name="start_time"
                    initialValue={ startTime }/>
                <TimeInput label="End" name="end_time"
                    initialValue={ endTime }/>
                <RelSelectInput label="Location" name="location_id"
                    objects={ locations }
                    initialValue={ action.location.id }/>
                <RelSelectInput label="Activity" name="activity_id"
                    objects={ activities }
                    initialValue={ action.activity.id }/>
                <TextArea label="Information" name="info_text"
                    initialValue={ action.info_text }/>

                <input key="submit" type="submit"/>
            </Form>
        );
    }

    getValues() {
        const values = this.refs.form.getValues();
        const date = new Date(values.date);

        updateTime(values, 'start_time', date);
        updateTime(values, 'end_time', date);
        delete values.date;

        return values;
    }

    getChangedValues() {
        const values = this.refs.form.getChangedValues();
        const date = new Date(this.refs.form.getValues().date);

        if ('date' in values) {
            const allValues = this.getValues();
            values.start_time = allValues.start_time;
            values.end_time = allValues.end_time;

            delete values.date;
        }
        else {
            if ('start_time' in values) {
                updateTime(values, 'start_time', date);
            }
            if ('end_time' in values) {
                updateTime(values, 'end_time', date);
            }
        }

        return values;
    }
}

function pad(n) {
    return (n<10)? '0' + n : n.toString();
}

function formatTime(d) {
    return pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes());
}

function updateTime(values, field, date) {
    const val = values[field];

    const fields = val.split(':');
    const hours = parseInt(fields[0]);
    const minutes = parseInt(fields[1]);
    const tmp = new Date(date);

    tmp.setHours(hours);
    tmp.setMinutes(minutes);
    tmp.setSeconds(0);

    values[field] = tmp.toISOString();
}
