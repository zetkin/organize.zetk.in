import {
    createList,
    createListItems,
    updateOrAddListItem,
    removeListItem,
} from '../utils/store';

import {
    CREATE_PERSON,
    RETRIEVE_PEOPLE,
    RETRIEVE_PERSON,
    UPDATE_PERSON,
    DELETE_PERSON,
} from '../actions';


export default function people(state = null, action) {
    let person;

    switch (action.type) {
        case RETRIEVE_PEOPLE + '_PENDING':
            return Object.assign({}, state, {
                personList: Object.assign({}, state.personList, {
                    isPending: true,
                    error: null,
                }),
            });

        case RETRIEVE_PEOPLE + '_FULFILLED':
            return Object.assign({}, state, {
                personList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data)
                }
            });

        case RETRIEVE_PEOPLE + '_REJECTED':
            return Object.assign({}, state, {
                personList: {
                    isPending: false,
                    error: action.payload,
                    items: [],
                }
            });

        case RETRIEVE_PERSON + '_PENDING':
            person = { id: action.meta.id };
            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                        person.id, person, { pending: true }),
            });

        case CREATE_PERSON + '_FULFILLED':
        case UPDATE_PERSON + '_FULFILLED':
        case RETRIEVE_PERSON + '_FULFILLED':
            person = action.payload.data.data;
            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                        person.id, person, { pending: false, error: null }),
            });

        case DELETE_PERSON + '_FULFILLED':
            return Object.assign({}, state, {
                personList: removeListItem(state.personList, action.meta.id),
            });

        default:
            return state || {
                personList: createList(),
            };
    }
}
