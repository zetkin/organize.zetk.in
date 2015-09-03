import CampaignFilter from './CampaignFilter';
import JoinDateFilter from './JoinDateFilter';
import PersonDataFilter from './PersonDataFilter';

const filterComponents = {
    'campaign': CampaignFilter,
    'join_date': JoinDateFilter,
    'person_data': PersonDataFilter
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
