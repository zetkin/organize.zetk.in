import { Actions } from 'flummox';
import Z from 'zetkin';


export default class CampaignActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveCampaigns() {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'campaigns').get();
    }
}
