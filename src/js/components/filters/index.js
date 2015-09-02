import JoinDateFilter from './JoinDateFilter';
import PersonDataFilter from './PersonDataFilter';

const filterComponents = {
    'join_date': JoinDateFilter,
    'person_data': PersonDataFilter
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
