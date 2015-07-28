import { Store } from 'flummox';


export default class CampaignStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            campaigns: []
        });

        var campaignActions = flux.getActions('campaign');
        this.register(campaignActions.retrieveCampaigns,
            this.onRetrieveCampaignsComplete);
    }

    getCampaigns() {
        return this.state.campaigns;
    }

    onRetrieveCampaignsComplete(res) {
        this.setState({
            campaigns: res.data.data
        });
    }
}
