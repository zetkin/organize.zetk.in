import { Store } from 'flummox';


export default class OrgStore extends Store {
    constructor(flux) {
        super();

        this.flux = flux;

        this.setState({
            activeId: null
        });

        var userActions = flux.getActions('user');
        this.register(userActions.getUserMemberships,
            this.onGetUserMembershipsComplete);
        this.register(userActions.setActiveMembership,
            this.onSetActiveMembershipComplete);
    }

    getActiveId() {
        return this.state.activeId;
    }

    onSetActiveMembershipComplete(membership) {
        this.setState({
            activeId: membership.organization.id
        });
    }

    onGetUserMembershipsComplete() {
        var userStore = this.flux.getStore('user');

        this.flux.waitFor(userStore);
        this.setState({
            activeId: userStore.getActiveMembership().organization.id
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
