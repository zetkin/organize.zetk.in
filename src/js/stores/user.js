import { Store } from 'flummox';


export default class UserStore extends Store {
    constructor(flux) {
        super();

        this.setState({
            user: null
        });

        var userActions = flux.getActions('user');
        this.register(userActions.getUserInfo, this.onGetUserInfoComplete);
    }

    getUserInfo() {
        return this.state.user;
    }

    onGetUserInfoComplete(res) {
        this.setState({
            user: res.data.data
        });
    }

    static serialize(state) {
        return JSON.stringify(state);
    }

    static deserialize(stateStr) {
        return JSON.parse(stateStr);
    }
}
