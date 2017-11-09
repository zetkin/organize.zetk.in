import AllFilter from './AllFilter';
import CallHistoryFilter from './CallHistoryFilter';
import CampaignFilter from './CampaignFilter';
import PersonDataFilter from './PersonDataFilter';
import PersonTagsFilter from './PersonTagsFilter';
import RandomFilter from './RandomFilter';
import SurveyOptionFilter from './SurveyOptionFilter';
import SurveyResponseFilter from './SurveyResponseFilter';
import SurveySubmissionFilter from './SurveySubmissionFilter';
import UserFilter from './UserFilter';

const filterComponents = {
    'all': AllFilter,
    'call_history': CallHistoryFilter,
    'campaign_participation': CampaignFilter,
    'person_data': PersonDataFilter,
    'person_tags': PersonTagsFilter,
    'random': RandomFilter,
    'survey_option': SurveyOptionFilter,
    'survey_response': SurveyResponseFilter,
    'survey_submission': SurveySubmissionFilter,
    'user': UserFilter,
};

export function resolveFilterComponent(type) {
    return filterComponents[type];
}
