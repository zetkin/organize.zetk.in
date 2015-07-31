import React from 'react/addons';

import FluxComponent from '../FluxComponent';
import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';
import RelSelectInput from './inputs/RelSelectInput';


export default class ActionForm extends FluxComponent {
    componentDidMount() {
        this.listenTo('activity', this.forceUpdate);
        this.listenTo('location', this.forceUpdate);
        this.getActions('activity').retrieveActivities();
        this.getActions('location').retrieveLocations();
    }

    render() {
        var action = this.props.action;
        var locations = this.getStore('location').getLocations();
        var activities = this.getStore('activity').getActivities();

        return (
            <Form ref="form" {...this.props }>
                <TextInput label="Start" name="start_time"
                    initialValue={ action.start_time }/>
                <TextInput label="End" name="end_time"
                    initialValue={ action.end_time }/>
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
        return this.refs.form.getValues();
    }

    getChangedValues() {
        return this.refs.form.getChangedValues();
    }
}
