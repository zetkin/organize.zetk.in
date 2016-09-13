import {
    createList,
    createListItems,
    getListItemById,
    removeListItem,
    updateOrAddListItem,
    updateOrAddListItems,
} from '../utils/store';

import * as types from '../actions';


export default function people(state = null, action) {
    let personItem;
    let person;
    let tags;

    switch (action.type) {
        case types.RETRIEVE_PEOPLE + '_PENDING':
            return Object.assign({}, state, {
                personList: Object.assign({}, state.personList, {
                    isPending: true,
                    error: null,
                }),
            });

        case types.RETRIEVE_PEOPLE + '_FULFILLED':
            return Object.assign({}, state, {
                personList: {
                    isPending: false,
                    error: null,
                    items: createListItems(action.payload.data.data)
                }
            });

        case types.RETRIEVE_PEOPLE + '_REJECTED':
            return Object.assign({}, state, {
                personList: {
                    isPending: false,
                    error: action.payload,
                    items: [],
                }
            });

        case types.RETRIEVE_ACTION_PARTICIPANTS + '_FULFILLED':
            let people = action.payload.data.data;
            return Object.assign({}, state, {
                personList: updateOrAddListItems(state.personList,
                    people, { isPending: false, error: null }),
            });

        case types.RETRIEVE_PERSON + '_PENDING':
            person = { id: action.meta.id };
            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                        person.id, person, { pending: true }),
            });

        case types.CREATE_PERSON + '_FULFILLED':
        case types.UPDATE_PERSON + '_FULFILLED':
        case types.RETRIEVE_PERSON + '_FULFILLED':
            person = action.payload.data.data;
            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                        person.id, person, { pending: false, error: null }),
            });

        case types.DELETE_PERSON + '_FULFILLED':
            return Object.assign({}, state, {
                personList: removeListItem(state.personList, action.meta.id),
            });

        case types.RETRIEVE_TAGS_FOR_PERSON + '_PENDING':
            person = {
                id: action.meta.id,
                tagList: createList(null, { isPending: true }),
            };

            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                    person.id, person),
            });

        case types.RETRIEVE_TAGS_FOR_PERSON + '_FULFILLED':
            tags = action.payload.data.data.map(t => ({ id: t.id }));
            person = {
                id: action.meta.id,
                tagList: createList(tags, { isPending: false }),
            };

            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                    person.id, person),
            });

        case types.ADD_TAGS_TO_PERSON + '_FULFILLED':
            personItem = getListItemById(state.personList, action.meta.id);
            if (personItem) {
                tags = action.meta.tagIds.map(id => ({ id }));
                person = Object.assign({}, personItem.data, {
                    id: action.meta.id,
                    tagList: updateOrAddListItems(
                        personItem.data.tagList, tags)
                });

                return Object.assign({}, state, {
                    personList: updateOrAddListItem(state.personList,
                        person.id, person),
                });
            }
            else {
                return state;
            }


        case types.REMOVE_TAG_FROM_PERSON + '_FULFILLED':
            personItem = getListItemById(state.personList, action.meta.id);
            if (personItem) {
                person = Object.assign({}, personItem.data, {
                    id: action.meta.id,
                    tagList: removeListItem(personItem.data.tagList,
                        action.meta.tagId)
                });

                return Object.assign({}, state, {
                    personList: updateOrAddListItem(state.personList,
                        person.id, person),
                });
            }
            else {
                return state;
            }

            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                    person.id, person),
            });

        default:
            return state || {
                personList: createList(),
            };
    }
}
