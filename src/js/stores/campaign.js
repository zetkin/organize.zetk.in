import { Store } from 'flummox';
import StoreUtils from '../utils/StoreUtils';


export default class CampaignStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            campaigns: []
        });

        var campaignActions = flux.getActions('campaign');
        this.register(campaignActions.retrieveCampaigns,
            this.onRetrieveCampaignsComplete);
        this.register(campaignActions.retrieveCampaign,
            this.onRetrieveCampaignComplete);
        this.register(campaignActions.createCampaign,
            this.onCreateCampaignComplete);
    }

    getCampaigns() {
        return this.state.campaigns;
    }

    getCampaign(id) {
        return this.state.campaigns.find(c => c.id == id);
    }

    onRetrieveCampaignsComplete(res) {
        this.setState({
            campaigns: res.data.data
        });
    }

    onRetrieveCampaignComplete(res) {
        var campaign = res.data.data;
    onCreateCampaignComplete(res) {
        const campaign = res.data.data;

        this.state.campaigns.push(campaign);

        this.setState({
            campaigns: this.state.campaigns
        });
    }

        StoreUtils.updateOrAdd(this.state.campaigns, campaign.id, campaign);

        this.setState({
            campaigns: this.state.campaigns
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
