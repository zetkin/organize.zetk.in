import AllFilter from './AllFilter';
import CallHistoryFilter from './CallHistoryFilter';
import CampaignFilter from './CampaignFilter';
import JoinDateFilter from './JoinDateFilter';
import PersonDataFilter from './PersonDataFilter';
import PersonTagsFilter from './PersonTagsFilter';
import RandomFilter from './RandomFilter';

const filterComponents = {
    'all': AllFilter,
    'call_history': CallHistoryFilter,
    'campaign_participation': CampaignFilter,
    'join_date': JoinDateFilter,
    'person_data': PersonDataFilter,
    'person_tags': PersonTagsFilter,
    'random': RandomFilter,
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
