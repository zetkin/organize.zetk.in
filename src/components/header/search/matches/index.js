import ActivityMatch from './ActivityMatch';
import ActionDayMatch from './ActionDayMatch';
import AssignedRouteMatch from './AssignedRouteMatch';
import CallAssignmentMatch from './CallAssignmentMatch';
import CampaignMatch from './CampaignMatch';
import CanvassAssignmentMatch from './CanvassAssignmentMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';
import RouteMatch from './RouteMatch';
import SurveyMatch from './SurveyMatch';
import SurveySubmissionMatch from './SurveySubmissionMatch';
import QueryMatch from './QueryMatch';

let _matches = {
    'activity': ActivityMatch,
    'actionday': ActionDayMatch,
    'assigned_route': AssignedRouteMatch,
    'call_assignment': CallAssignmentMatch,
    'canvass_assignment': CanvassAssignmentMatch,
    'campaign': CampaignMatch,
    'location': LocationMatch,
    'person': PersonMatch,
    'canvass_route': RouteMatch,
    'survey': SurveyMatch,
    'surveysubmission': SurveySubmissionMatch,
    'personquery': QueryMatch,
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
