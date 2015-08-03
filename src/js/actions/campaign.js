import { Actions } from 'flummox';
import Z from 'zetkin';


export default class CampaignActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    createCampaign(data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'campaigns').post(data);
    }

    retrieveCampaigns() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'campaigns').get();
    }

    retrieveCampaign(campaignId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'campaigns', campaignId).get();
    }
}
