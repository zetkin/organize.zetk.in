import ActionPane from './ActionPane';
import ActionDayPane from './ActionDayPane';
import ActionReminderPane from './ActionReminderPane';
import AddActionPane from './AddActionPane';
import AddActivityPane from './AddActivityPane';
import AddCallAssignmentPane from './AddCallAssignmentPane';
import AddCampaignPane from './AddCampaignPane';
import AddPersonPane from './AddPersonPane';
import AddPersonTagPane from './AddPersonTagPane';
import AddLocationPane from './AddLocationPane';
import AddLocationTagPane from './AddLocationTagPane'
import AddSurveyQuestionPane from './AddSurveyQuestionPane';
import BulkOpPane from './BulkOpPane';
import CallPane from './CallPane';
import CallAssignmentPane from './CallAssignmentPane';
import CampaignPane from './CampaignPane';
import EditActionPane from './EditActionPane';
import EditActivityPane from './EditActivityPane';
import EditCallAssignmentPane from './EditCallAssignmentPane';
import EditCallerPane from './EditCallerPane';
import EditCampaignPane from './EditCampaignPane';
import EditLocationPane from './EditLocationPane';
import EditLocationTagPane from './EditLocationTagPane';
import EditPersonPane from './EditPersonPane';
import EditPersonTagPane from './EditPersonTagPane';
import EditQueryPane from './EditQueryPane';
import EditSurveyPane from './EditSurveyPane';
import EditSurveyQuestionPane from './EditSurveyQuestionPane';
import EditSurveyTextBlockPane from './EditSurveyTextBlockPane';
import EditTextPane from './EditTextPane';
import LocationPane from './LocationPane';
import ImporterColumnPane from './ImporterColumnPane';
import MoveParticipantsPane from './MoveParticipantsPane';
import PersonPane from './PersonPane';
import PlaceLocationPane from './PlaceLocationPane';
import QueryPane from './QueryPane';
import SelectPeoplePane from './SelectPeoplePane';
import SelectLocationTagsPane from './SelectLocationTagsPane';
import SelectPersonTagsPane from './SelectPersonTagsPane';
import SurveyPane from './SurveyPane';
import SurveyOutlinePane from './SurveyOutlinePane';
import SurveySubmissionPane from './SurveySubmissionPane';

var _panes = {
    'action': ActionPane,
    'actionday': ActionDayPane,
    'actionreminder': ActionReminderPane,
    'addaction': AddActionPane,
    'addactivity': AddActivityPane,
    'addcallassignment': AddCallAssignmentPane,
    'addcampaign': AddCampaignPane,
    'addlocation': AddLocationPane,
    'addlocationtag': AddLocationTagPane,
    'addperson': AddPersonPane,
    'addpersontag': AddPersonTagPane,
    'addsurveyquestion': AddSurveyQuestionPane,
    'bulk': BulkOpPane,
    'call': CallPane,
    'callassignment': CallAssignmentPane,
    'campaign': CampaignPane,
    'editaction': EditActionPane,
    'editactivity': EditActivityPane,
    'editcallassignment': EditCallAssignmentPane,
    'editcaller': EditCallerPane,
    'editcampaign': EditCampaignPane,
    'editlocation': EditLocationPane,
    'editlocationtag': EditLocationTagPane,
    'editperson': EditPersonPane,
    'editpersontag': EditPersonTagPane,
    'editquery': EditQueryPane,
    'editsurvey': EditSurveyPane,
    'editsurveyquestion': EditSurveyQuestionPane,
    'editsurveytextblock': EditSurveyTextBlockPane,
    'edittext': EditTextPane,
    'importercolumn': ImporterColumnPane,
    'location': LocationPane,
    'moveparticipants': MoveParticipantsPane,
    'person': PersonPane,
    'placelocation': PlaceLocationPane,
    'query': QueryPane,
    'selectpeople': SelectPeoplePane,
    'selectlocationtags': SelectLocationTagsPane,
    'selectpersontags': SelectPersonTagsPane,
    'survey': SurveyPane,
    'surveyoutline': SurveyOutlinePane,
    'surveysubmission': SurveySubmissionPane,
};

export function resolvePane(name) {
    if (name in _panes) {
        return _panes[name];
    }
    else {
        return null;
    }
}

export default {
    resolve: resolvePane
};
