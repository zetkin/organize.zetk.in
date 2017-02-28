import ActionDayMatch from './ActionDayMatch';
import CallAssignmentMatch from './CallAssignmentMatch';
import CampaignMatch from './CampaignMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';
import SurveyMatch from './SurveyMatch';
import QueryMatch from './QueryMatch';

let _matches = {
    'actionday': ActionDayMatch,
    'call_assignment': CallAssignmentMatch,
    'campaign': CampaignMatch,
    'location': LocationMatch,
    'person': PersonMatch,
    'survey': SurveyMatch,
    'query': QueryMatch,
};


export function resolveMatchComponent(name) {
    if (name in _matches) {
        return _matches[name];
    }
    else {
        return null;
    }
}

export default {
    resolve: resolveMatchComponent
};
