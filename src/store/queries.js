import { createList } from '../utils/store';


export default function queries(state = null, action) {
    // TODO: Implement proper API communications
    switch (action.type) {
        default:
            return state || {
                queryList: createList()
            };
    }
}
