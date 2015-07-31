import { Actions } from 'flummox';
import Z from 'zetkin';


export default class ParticipantActions extends Actions {
    constructor(flux) {
        super();

        this.flux = flux;
    }

    retrieveParticipants(actionId) {
        var orgId = this.flux.getStore('org').getActiveId();
        return Z.resource('orgs', orgId, 'actions', actionId, 'participants')
                .meta('actionId', actionId)
                .get();
    }
}
