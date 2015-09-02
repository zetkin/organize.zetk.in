import { Actions } from 'flummox';


export default class DashboardActions extends Actions {
    moveWidget(moveType, beforeType) {
        return { moveType, beforeType };
    }
}
