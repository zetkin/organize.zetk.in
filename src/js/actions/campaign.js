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

    updateCampaign(id, data) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'campaigns', id).patch(data);
    }

    retrieveCampaign(campaignId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'campaigns', campaignId).get();
    }
}
