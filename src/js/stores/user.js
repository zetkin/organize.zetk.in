import { Store } from 'flummox';


export default class UserStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            user: null,
            memberships: null,
            activeMembership: null,
            accountsHost: process.env.ZETKIN_ACCOUNTS_HOST
        });

        var userActions = flux.getActions('user');
        this.register(userActions.getUserInfo, this.onGetUserInfoComplete);
        this.register(userActions.getUserMemberships,
            this.onGetUserMembershipsComplete);
        this.register(userActions.setActiveMembership,
            this.onSetActiveMembershipComplete);
    }

    getUserInfo() {
        return this.state.user;
    }

    getMemberships() {
        return this.state.memberships;
    }

    isOfficial() {
        return (this.state.memberships.length > 0);
    }

    getActiveMembership() {
        return this.state.activeMembership;
    }

    getAccountsHost() {
        return this.state.accountsHost;
    }

    onGetUserInfoComplete(res) {
        this.setState({
            user: res.data.data
        });
    }

    onSetActiveMembershipComplete(membership) {
        this.setState({
            activeMembership: membership
        });
    }

    onGetUserMembershipsComplete(res) {
        var i;
        var memberships = res.data.data;
        var officialMemberships = [];

        for (i in memberships) {
            if (memberships[i].role != null) {
                officialMemberships.push(memberships[i]);
            }
        }

        this.setState({
            memberships: officialMemberships,
            activeMembership: (officialMemberships.length > 0)?
                officialMemberships[0] : null
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
