import AllFilter from './AllFilter';
import CallHistoryFilter from './CallHistoryFilter';
import CallerFilter from './CallerFilter';
import CampaignFilter from './CampaignFilter';
import MostActiveFilter from './MostActiveFilter';
import PersonDataFilter from './PersonDataFilter';
import PersonFieldFilter from './PersonFieldFilter';
import PersonTagsFilter from './PersonTagsFilter';
import RandomFilter from './RandomFilter';
import SubQueryFilter from './SubQueryFilter';
import SurveyOptionFilter from './SurveyOptionFilter';
import SurveyResponseFilter from './SurveyResponseFilter';
import SurveySubmissionFilter from './SurveySubmissionFilter';
import UserFilter from './UserFilter';

const filterComponents = {
    'all': AllFilter,
    'call_history': CallHistoryFilter,
    'caller': CallerFilter,
    'campaign_participation': CampaignFilter,
    'most_active': MostActiveFilter,
    'person_data': PersonDataFilter,
    'person_field': PersonFieldFilter,
    'person_tags': PersonTagsFilter,
    'random': RandomFilter,
    'sub_query': SubQueryFilter,
    'survey_option': SurveyOptionFilter,
    'survey_response': SurveyResponseFilter,
    'survey_submission': SurveySubmissionFilter,
    'user': UserFilter,
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
