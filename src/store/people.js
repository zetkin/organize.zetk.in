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

    if (action.type == types.ADD_DUPLICATE_PERSON || action.type == types.REMOVE_DUPLICATE_PERSON) {
        const dupItem = getListItemById(state.duplicateList, action.payload.id);
        let objects = dupItem.data.objects.filter(p => p.id !== action.payload.person.id);

        if (action.type == types.ADD_DUPLICATE_PERSON) {
            objects.push(action.payload.person);
        }

        return Object.assign({}, state, {
            duplicateList: updateOrAddListItem(state.duplicateList,
                action.payload.id, { objects }),
        });
    }
    else if (action.type == types.EXECUTE_BULK_OPERATION + '_FULFILLED'
        && action.meta.op == 'person.delete') {
        let list = state.personList;
        action.meta.objects.forEach(id => {
            list = removeListItem(list, id);
        });

        return Object.assign({}, state, {
            personList: list,
        });
    }

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
                personList: updateOrAddListItems(state.personList, action.payload.data.data, {
                    isPending: false,
                    error: null,
                    lastPage: Math.max(state.personList.lastPage, action.meta.page),
                })
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
                        person.id, person, { isPending: true }),
            });

        case types.CREATE_PERSON + '_FULFILLED':
        case types.UPDATE_PERSON + '_FULFILLED':
        case types.RETRIEVE_PERSON + '_FULFILLED':
            person = action.payload.data.data;
            return Object.assign({}, state, {
                personList: updateOrAddListItem(state.personList,
                        person.id, person, { isPending: false, error: null }),
            });

        case types.DELETE_PERSON + '_FULFILLED':
            return Object.assign({}, state, {
                personList: removeListItem(state.personList, action.meta.id),
            });

        case types.DELETE_CONNECTION + '_FULFILLED':
            return Object.assign({}, state, {
                personList: removeListItem(state.personList, action.meta.person),
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

        case types.FIND_PERSON_DUPLICATES + '_PENDING':
            return Object.assign({}, state, {
                duplicateList: createList([], { isPending: true }),
            });

        case types.FIND_PERSON_DUPLICATES + '_FULFILLED':
            return Object.assign({}, state, {
                duplicateList: createList(action.payload.duplicates,
                    { isPending: false, error: null }),
            });

        case types.CLEAR_PERSON_DUPLICATES:
            return Object.assign({}, state, {
                duplicateList: null,
            });

        case types.MERGE_PERSON_DUPLICATES + '_FULFILLED':
            return Object.assign({}, state, {
                duplicateList: removeListItem(state.duplicateList, action.meta.id),
            });

        case types.CREATE_PERSON_DUPLICATE_SET:
            return Object.assign({}, state, {
                duplicateList: updateOrAddListItem(state.duplicateList, action.payload.id, {
                    id: action.payload.id,
                    objects: action.payload.people || [],
                    manual: true,
                    scores: [],
                }),
            });

        case types.DELETE_TAG + '_FULFILLED':
            // Remove deleted tag from taglist of all people
            const personList = state.personList;
            personList.items = personList.items.map(p => {
                if(p.data.tagList)
                    p.data.tagList.items = p.data.tagList.items.filter(
                                        t => t.data &&t.data.id != action.meta.id)
                return p;
            });
            return Object.assign({}, state, {
                personList: personList,
            });

        default:
            return state || {
                personList: createList(),
                duplicateList: null,
            };
    }
}
