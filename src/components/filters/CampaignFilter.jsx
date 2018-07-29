import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import DateInput from '../forms/inputs/DateInput';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import { retrieveCampaigns } from '../../actions/campaign';
import { retrieveActivities } from '../../actions/activity';
import { retrieveLocations } from '../../actions/location';


const mapStateToProps = state => {
    const campaignList = state.campaigns.campaignList;
    const locationList = state.locations.locationList;
    const activityList = state.activities.activityList;

    return {
        activityList,
        campaignList,
        locationList,
    };
};

@connect(mapStateToProps)
@injectIntl
export default class CampaignFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(stateFromConfig(nextProps.config));
    }

    componentDidMount() {
        super.componentDidMount();

        const { campaignList, activityList, locationList } = this.props;

        if (campaignList.items.length == 0 && !campaignList.isPending) {
            this.props.dispatch(retrieveCampaigns());
        }

        if (activityList.items.length == 0 && !activityList.isPending) {
            this.props.dispatch(retrieveActivities());
        }

        if (locationList.items.length == 0 && !locationList.isPending) {
            this.props.dispatch(retrieveLocations());
        }
    }

    renderFilterForm(config) {
        let campaignStore = this.props.campaigns;
        let timeframe = this.state.timeframe;

        const msg = id => this.props.intl.formatMessage({ id });

        const OP_STATE_OPTIONS = {
            'in_b': msg('filters.campaign.opOptions.inBooked'),
            'in_su': msg('filters.campaign.opOptions.inSignedUp'),
            'notin_b': msg('filters.campaign.opOptions.notInBooked'),
            'notin_su': msg('filters.campaign.opOptions.notInSignedUp'),
        };

        const DATE_OPTIONS = {
            'any': msg('filters.campaign.timeframe.options.any'),
            'future': msg('filters.campaign.timeframe.options.future'),
            'past': msg('filters.campaign.timeframe.options.past'),
            'after': msg('filters.campaign.timeframe.options.after'),
            'before': msg('filters.campaign.timeframe.options.before'),
            'between': msg('filters.campaign.timeframe.options.between'),
        };

        const CAMPAIGN_OPTIONS = {};
        const campaignItems = this.props.campaignList.items || [];
        campaignItems.forEach(item => {
            const campaign = item.data;
            CAMPAIGN_OPTIONS[campaign.id] = campaign.title;
        });

        const LOCATION_OPTIONS = {};
        const locationItems = this.props.locationList.items || [];
        locationItems.forEach(item => {
            const location = item.data;
            LOCATION_OPTIONS[location.id] = location.title;
        });

        const ACTIVITY_OPTIONS = {};
        const activityItems = this.props.activityList.items || [];
        activityItems.forEach(item => {
            const activity = item.data;
            ACTIVITY_OPTIONS[activity.id] = activity.title;
        });

        let afterInput = null;
        if (timeframe == 'after' || timeframe == 'between') {
            afterInput = (
                <DateInput key="after" name="after"
                    className="CampaignFilter-after"
                    value={ this.state.after }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        let beforeInput = null;
        if (timeframe == 'before' || timeframe == 'between') {
            beforeInput = (
                <DateInput key="before" name="before"
                    className="CampaignFilter-before"
                    value={ this.state.before }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        return [
            <SelectInput key="operator" name="op"
                labelMsg="filters.campaign.participantStatus"
                options={ OP_STATE_OPTIONS } value={ this.state.op }
                onValueChange={ this.onChangeSimpleField.bind(this) }/>,

            <SelectInput key="campaign" name="campaign"
                labelMsg="filters.campaign.campaign.label"
                options={ CAMPAIGN_OPTIONS } value={ this.state.campaign }
                nullOptionMsg="filters.campaign.campaign.nullOption"
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,

            <SelectInput key="activity" name="activity"
                labelMsg="filters.campaign.activity.label"
                options={ ACTIVITY_OPTIONS } value={ this.state.activity }
                nullOptionMsg="filters.campaign.activity.nullOption"
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,

            <SelectInput key="location" name="location"
                labelMsg="filters.campaign.location.label"
                options={ LOCATION_OPTIONS } value={ this.state.location }
                nullOptionMsg="filters.campaign.location.nullOption"
                onValueChange={ this.onChangeSimpleField.bind(this) }
                />,

            <SelectInput key="timeframe" name="timeframe"
                labelMsg="filters.campaign.timeframe.label"
                options={ DATE_OPTIONS } value={ this.state.timeframe }
                onValueChange={ this.onSelectTimeframe.bind(this) }/>,

            afterInput,
            beforeInput,
        ];
    }

    getConfig() {
        let opFields = this.state.op.split('_');

        return {
            operator: opFields[0],
            campaign: this.state.campaign,
            activity: this.state.activity,
            location: this.state.location,
            state: (opFields[1] == 'su')? 'signed_up' : 'booked',
            before: this.state.before,
            after: this.state.after,
        };
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state, () => this.onConfigChange());
    }

    onSelectTimeframe(name, value) {
        let before = undefined;
        let after = undefined;
        let today = Date.create();
        let todayStr = today.format('{yyyy}-{MM}-{dd}');

        switch (value) {
            case 'future':
                after = 'now';
                break;
            case 'past':
                before = 'now';
                break;
            case 'after':
                after = todayStr;
                break;
            case 'before':
                before = todayStr;
                break;
            case 'between':
                after = todayStr;
                before = today.addDays(30).format('{yyyy}-{MM}-{dd}');
                break;
        }

        this.setState({ timeframe: value, before, after }, () =>
            this.onConfigChange());
    }
}

function stateFromConfig(config) {
    let opPrefix = config.operator || 'in';
    let opSuffix = (config.state == 'signed_up')? 'su' : 'b';

    let state = {
        op: opPrefix + '_' + opSuffix,
        campaign: config.campaign,
        activity: config.activity,
        location: config.location,
        before: config.before,
        after: config.after,
    }

    state.timeframe = 'any';
    if (config.before && config.after) {
        state.timeframe = 'between';
    }
    else if (config.before == 'now') {
        state.timeframe = 'past';
    }
    else if (config.before) {
        state.timeframe = 'before';
    }
    else if (config.after == 'now') {
        state.timeframe = 'future';
    }
    else if (config.after) {
        state.timeframe = 'after';
    }

    return state;
}
