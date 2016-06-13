import React from 'react';

import Form from './Form';
import IntInput from './inputs/IntInput';
import DateInput from './inputs/DateInput';
import TextArea from './inputs/TextArea';
import TimeInput from './inputs/TimeInput';
import RelSelectInput from './inputs/RelSelectInput';
import { retrieveLocations } from '../../actions/location';
import { retrieveCampaigns } from '../../actions/campaign';
import { retrieveActivities } from '../../actions/activity';


export default class ActionForm extends React.Component {
    componentDidMount() {
        this.props.dispatch(retrieveCampaigns());
        this.props.dispatch(retrieveLocations());
        this.props.dispatch(retrieveActivities());
    }

    render() {
        const action = this.props.action || {
            campaign: {},
            location: {},
            activity: {}
        };

        const campaigns = this.props.campaigns.campaignList.items.map(i => i.data);
        const locations = this.props.locations.locationList.items.map(i => i.data);
        const activities = this.props.activities.activityList.items.map(i => i.data);
        const startDate = Date.utc.create(action.start_time);
        const endDate = Date.utc.create(action.end_time);

        const date = startDate.isValid()?
            startDate.setUTC(true).format('{yyyy}-{MM}-{dd}') : undefined;

        const startTime = startDate.isValid()?
            startDate.setUTC(true).format('{HH}:{mm}') : undefined;

        const endTime = endDate.isValid()?
            endDate.setUTC(true).format('{HH}:{mm}') : undefined;

        return (
            <Form className="ActionForm" ref="form" {...this.props }>
                <RelSelectInput label="Campaign" name="campaign_id"
                    objects={ campaigns } showEditLink={ true }
                    onCreate={ this.props.onCreateCampaign }
                    onEdit={ this.props.onEditCampaign }
                    initialValue={ action.campaign.id }/>
                <DateInput label="Date" name="date"
                    initialValue={ date }/>
                <TimeInput label="Start" name="start_time"
                    initialValue={ startTime }/>
                <TimeInput label="End" name="end_time"
                    initialValue={ endTime }/>
                <IntInput label="Minimum participants"
                    name="num_participants_required"
                    initialValue={ action.num_participants_required || 2 }/>
                <RelSelectInput label="Location" name="location_id"
                    objects={ locations } showEditLink={ true }
                    onCreate={ this.props.onCreateLocation }
                    onEdit={ this.props.onEditLocation }
                    initialValue={ action.location.id }/>
                <RelSelectInput label="Activity" name="activity_id"
                    objects={ activities } showEditLink={ true }
                    onCreate={ this.props.onCreateActivity }
                    onEdit={ this.props.onEditActivity }
                    initialValue={ action.activity.id }/>
                <TextArea label="Information" name="info_text"
                    initialValue={ action.info_text }/>

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

ActionForm.propTypes = {
    onEditCampaign: React.PropTypes.func,
    onEditLocation: React.PropTypes.func,
    onEditActivity: React.PropTypes.func,
    onCreateCampaign: React.PropTypes.func,
    onCreateLocation: React.PropTypes.func,
    onCreateActivity: React.PropTypes.func
};

function updateTime(values, field, date) {
    const val = values[field];

    const fields = val.split(':');
    const hours = parseInt(fields[0]);
    const minutes = parseInt(fields[1]);
    const tmp = new Date(date);

    tmp.setUTCHours(hours);
    tmp.setUTCMinutes(minutes);
    tmp.setUTCSeconds(0);

    values[field] = tmp.toISOString();
}
