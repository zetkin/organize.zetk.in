import { Store } from 'flummox';
import StoreUtils from '../utils/StoreUtils';


export default class CampaignStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            campaigns: [],
            selectedIndex: undefined
        });

        var campaignActions = flux.getActions('campaign');
        this.register(campaignActions.retrieveCampaigns,
            this.onRetrieveCampaignsComplete);
        this.register(campaignActions.retrieveCampaign,
            this.onRetrieveCampaignComplete);
        this.register(campaignActions.createCampaign,
            this.onCreateCampaignComplete);
        this.register(campaignActions.updateCampaign,
            this.onUpdateCampaignComplete);
        this.register(campaignActions.deleteCampaign,
            this.onDeleteCampaignComplete);
        this.register(campaignActions.selectCampaign,
            this.onSelectCampaignComplete);
    }

    getCampaigns() {
        return this.state.campaigns;
    }

    getCampaign(id) {
        return this.state.campaigns.find(c => c.id == id);
    }

    getSelectedCampaign() {
        if (this.state.selectedIndex >= 0) {
            return this.state.campaigns[this.state.selectedIndex];
        }
        else {
            return null;
        }
    }

    onRetrieveCampaignsComplete(res) {
        this.setState({
            campaigns: res.data.data
        });
    }

    onRetrieveCampaignComplete(res) {
        var campaign = res.data.data;
        StoreUtils.updateOrAdd(this.state.campaigns, campaign.id, campaign);

        this.setState({
            campaigns: this.state.campaigns
        });
    }

    onCreateCampaignComplete(res) {
        const campaign = res.data.data;

        this.state.campaigns.push(campaign);

        this.setState({
            campaigns: this.state.campaigns
        });
    }

    onUpdateCampaignComplete(res) {
        const campaign = res.data.data;

        StoreUtils.updateOrAdd(this.state.campaigns, campaign.id, campaign);

        this.setState({
            campaigns: this.state.campaigns
        });
    }

    onDeleteCampaignComplete(res) {
        const campaignId = res.meta.campaignId;

        StoreUtils.remove(this.state.campaigns, campaignId);
        this.setState({
            campaigns: this.state.campaigns
        });
    }

    onSelectCampaignComplete(id) {
        var i;

        for (i = 0; i < this.state.campaigns.length; i++) {
            if (this.state.campaigns[i].id == id) {
                this.setState({
                    selectedIndex: i
                });

                return;
            }
        }

        this.setState({
            selectedIndex: undefined
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
