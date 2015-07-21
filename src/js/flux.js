import Flummox from 'flummox';

import DashboardStore from './stores/dashboard';


export default class Flux extends Flummox {
    constructor() {
        super();

        this.createStore('dashboard', DashboardStore, this);
    }
}
