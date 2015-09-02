import PersonDataFilter from './PersonDataFilter';

const filterComponents = {
    'person_data': PersonDataFilter
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
