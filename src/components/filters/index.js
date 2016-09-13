import CallHistoryFilter from './CallHistoryFilter';
import CampaignFilter from './CampaignFilter';
import JoinDateFilter from './JoinDateFilter';
import PersonDataFilter from './PersonDataFilter';
import PersonTagsFilter from './PersonTagsFilter';

const filterComponents = {
    'call_history': CallHistoryFilter,
    'campaign_participation': CampaignFilter,
    'join_date': JoinDateFilter,
    'person_data': PersonDataFilter,
    'person_tags': PersonTagsFilter,
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
