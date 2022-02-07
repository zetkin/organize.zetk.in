import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import Form from '../forms/Form';
import FilterTimeFrameSelect from './FilterTimeFrameSelect';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import SelectInput from '../forms/inputs/SelectInput';
import RelSelectInput from '../forms/inputs/RelSelectInput';
import filterByOrg from '../../utils/filterByOrg';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';
import { retrieveCampaignsRecursive } from '../../actions/campaign';
import { retrieveActivitiesRecursive } from '../../actions/activity';
import { retrieveLocationsRecursive } from '../../actions/location';


const mapStateToProps = state => {
    const campaignList = state.campaigns.campaignList;
    const locationList = state.locations.locationList;
    const activityList = state.activities.activityList;
    const orgList = flattenOrganizationsFromState(state);

    return {
        activityList,
        campaignList,
        locationList,
        orgList,
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
        if (nextProps.config !== this.props.config) {
            this.setState(stateFromConfig(nextProps.config));
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const { campaignList, activityList, locationList } = this.props;

        if ((campaignList.items.length == 0 || !campaignList.recursive) && !campaignList.isPending) {
            this.props.dispatch(retrieveCampaignsRecursive());
        }

        if ((activityList.items.length == 0 || ! activityList.recursive) && !activityList.isPending) {
            this.props.dispatch(retrieveActivitiesRecursive());
        }

        if ((locationList.items.length == 0 || !locationList.recursive) && !locationList.isPending) {
            this.props.dispatch(retrieveLocationsRecursive());
        }
    }

    renderFilterForm(config) {
        let campaignStore = this.props.campaigns;

        const msg = id => this.props.intl.formatMessage({ id });

        const OP_STATE_OPTIONS = {
            'in_b': msg('filters.campaign.opOptions.inBooked'),
            'in_su': msg('filters.campaign.opOptions.inSignedUp'),
            'notin_b': msg('filters.campaign.opOptions.notInBooked'),
            'notin_su': msg('filters.campaign.opOptions.notInSignedUp'),
        };

        const CAMPAIGN_OPTIONS = {};
        // Filter campaigns by selected organizations
        let campaignItems = this.props.campaignList.items || [];
        campaignItems = filterByOrg(this.props.orgList, campaignItems, this.state);
        campaignItems.forEach(item => {
            const campaign = item.data;
            CAMPAIGN_OPTIONS[campaign.id] = campaign.title;
        });

        const LOCATION_OPTIONS = {};
        // Filter locations by selected organizations
        let locationItems = this.props.locationList.items || [];
        locationItems = filterByOrg(this.props.orgList, locationItems, this.state);
        locationItems.forEach(item => {
            const location = item.data;
            LOCATION_OPTIONS[location.id] = location.title;
        });

        const ACTIVITY_OPTIONS = {};
        // Filter activities by selected organizations
        let activityItems = this.props.activityList.items || [];
        activityItems = filterByOrg(this.props.orgList, activityItems, this.state);
        activityItems.forEach(item => {
            const activity = item.data;
            ACTIVITY_OPTIONS[activity.id] = activity.title;
        });

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,

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

            <FilterTimeFrameSelect key="timeframe"
                config={ this.state }
                labelMsgStem="filters.campaign.timeframe"
                onChange={ this.onChangeTimeFrame.bind(this) }
                />,
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
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
        };
    }

    onChangeTimeFrame({ before, after }) {
        this.setState({ before, after }, () => this.onConfigChange());
    }

    onChangeSimpleField(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state, () => this.onConfigChange());
    }

    onChangeOrganizations(orgState) {
        this.setState(orgState, () => this.onConfigChange());
    }

    setState(partialState, callback) {
        super.setState(partialState, callback)
        console.log(this, partialState)
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
        organizationOption: config.organizationOption || 'all',
        specificOrganizations: config.specificOrganizations || [],
    }

    return state;
}
