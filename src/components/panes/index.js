import ActionPane from './ActionPane';
import ActionDayPane from './ActionDayPane';
import ActionReminderPane from './ActionReminderPane';
import AddActionPane from './AddActionPane';
import AddActivityPane from './AddActivityPane';
import AddCallAssignmentPane from './AddCallAssignmentPane';
import AddCampaignPane from './AddCampaignPane';
import AddCanvassAssignmentPane from './AddCanvassAssignmentPane';
import AddGroupPane from './AddGroupPane';
import AddPersonPane from './AddPersonPane';
import AddPersonTagPane from './AddPersonTagPane';
import AddLocationPane from './AddLocationPane';
import AddLocationTagPane from './AddLocationTagPane'
import AddSmsDistributionPane from './AddSmsDistributionPane';
import AddSurveyPane from './AddSurveyPane';
import AddSurveyQuestionPane from './AddSurveyQuestionPane';
import AddSurveyTextBlockPane from './AddSurveyTextBlockPane';
import AddQueryPane from './AddQueryPane';
import AddressPane from './AddressPane';
import AssignRoutePane from './AssignRoutePane';
import AssignedRoutePane from './AssignedRoutePane';
import AssignedRouteVisitsPane from './AssignedRouteVisitsPane';
import BulkOpPane from './BulkOpPane';
import CallPane from './CallPane';
import CallAssignmentPane from './CallAssignmentPane';
import CallAssignmentTargetsPane from './CallAssignmentTargetsPane';
import CampaignPane from './CampaignPane';
import CanvassAssignmentPane from './CanvassAssignmentPane';
import LinkSubmissionPane from './LinkSubmissionPane';
import EditActionPane from './EditActionPane';
import EditActivityPane from './EditActivityPane';
import EditCallAssignmentPane from './EditCallAssignmentPane';
import EditCallerPane from './EditCallerPane';
import EditCampaignPane from './EditCampaignPane';
import EditCanvassAssignmentPane from './EditCanvassAssignmentPane';
import EditGroupPane from './EditGroupPane';
import EditLocationPane from './EditLocationPane';
import EditLocationTagPane from './EditLocationTagPane';
import EditPersonPane from './EditPersonPane';
import EditPersonTagPane from './EditPersonTagPane';
import EditQueryPane from './EditQueryPane';
import EditRoutePane from './EditRoutePane';
import EditSmsDistributionPane from './EditSmsDistributionPane';
import EditSurveyPane from './EditSurveyPane';
import EditSurveyQuestionPane from './EditSurveyQuestionPane';
import EditSurveyTextBlockPane from './EditSurveyTextBlockPane';
import EditTextPane from './EditTextPane';
import GroupPane from './GroupPane';
import GroupMembersPane from './GroupMembersPane';
import ImportActionsPane from './ImportActionsPane';
import LocationPane from './LocationPane';
import MergePeoplePane from './MergePeoplePane';
import ImporterColumnPane from './ImporterColumnPane';
import MoveParticipantsPane from './MoveParticipantsPane';
import PersonPane from './PersonPane';
import PersonTimelinePane from './PersonTimelinePane';
import PlaceLocationPane from './PlaceLocationPane';
import PurchaseSmsDistributionCreditsPane from './PurchaseSmsDistributionCreditsPane';
import QueryPane from './QueryPane';
import QueryDiffPane from './QueryDiffPane';
import RoutePane from './RoutePane';
import RouteContentPane from './RouteContentPane';
import RouteFromAddressesPane from './RouteFromAddressesPane';
import SelectAssignmentRoutesPane from './SelectAssignmentRoutesPane';
import SelectPeoplePane from './SelectPeoplePane';
import SelectLocationTagsPane from './SelectLocationTagsPane';
import SelectStreetAddressPane from './SelectStreetAddressPane';
import SelectPersonTagsPane from './SelectPersonTagsPane';
import SmsDistributionPane from './SmsDistributionPane';
import SmsDistributionCreditTransactionPane from './SmsDistributionCreditTransactionPane';
import SmsDistributionCreditTransactionsPane from './SmsDistributionCreditTransactionsPane';
import SmsDistributionMessagesPane from './SmsDistributionMessagesPane';
import SmsDistributionTargetsPane from './SmsDistributionTargetsPane';
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
    'addcanvassassignment': AddCanvassAssignmentPane,
    'addgroup': AddGroupPane,
    'addlocation': AddLocationPane,
    'addlocationtag': AddLocationTagPane,
    'addperson': AddPersonPane,
    'addpersontag': AddPersonTagPane,
    'addsmsdistribution': AddSmsDistributionPane,
    'addsurvey': AddSurveyPane,
    'addsurveyquestion': AddSurveyQuestionPane,
    'addsurveytextblock': AddSurveyTextBlockPane,
    'addquery': AddQueryPane,
    'address': AddressPane,
    'assignroute': AssignRoutePane,
    'assignedroute': AssignedRoutePane,
    'assignedroutevisits': AssignedRouteVisitsPane,
    'bulk': BulkOpPane,
    'call': CallPane,
    'callassignment': CallAssignmentPane,
    'callassignmenttargets': CallAssignmentTargetsPane,
    'campaign': CampaignPane,
    'canvassassignment': CanvassAssignmentPane,
    'linksubmission': LinkSubmissionPane,
    'editaction': EditActionPane,
    'editactivity': EditActivityPane,
    'editcallassignment': EditCallAssignmentPane,
    'editcaller': EditCallerPane,
    'editcampaign': EditCampaignPane,
    'editcanvassassignment': EditCanvassAssignmentPane,
    'editgroup': EditGroupPane,
    'editlocation': EditLocationPane,
    'editlocationtag': EditLocationTagPane,
    'editperson': EditPersonPane,
    'editpersontag': EditPersonTagPane,
    'editquery': EditQueryPane,
    'editroute': EditRoutePane,
    'editsmsdistribution': EditSmsDistributionPane,
    'editsurvey': EditSurveyPane,
    'editsurveyquestion': EditSurveyQuestionPane,
    'editsurveytextblock': EditSurveyTextBlockPane,
    'edittext': EditTextPane,
    'group': GroupPane,
    'groupmembers': GroupMembersPane,
    'importactions': ImportActionsPane,
    'importercolumn': ImporterColumnPane,
    'location': LocationPane,
    'mergepeople': MergePeoplePane,
    'moveparticipants': MoveParticipantsPane,
    'person': PersonPane,
    'placelocation': PlaceLocationPane,
    'purchasesmsdistributioncredits': PurchaseSmsDistributionCreditsPane,
    'query': QueryPane,
    'querydiff': QueryDiffPane,
    'route': RoutePane,
    'routecontent': RouteContentPane,
    'routefromaddresses': RouteFromAddressesPane,
    'selectassignmentroutes': SelectAssignmentRoutesPane,
    'selectpeople': SelectPeoplePane,
    'selectlocationtags': SelectLocationTagsPane,
    'selectpersontags': SelectPersonTagsPane,
    'selectstreetaddr': SelectStreetAddressPane,
    'smsdistribution': SmsDistributionPane,
    'smsdistributioncredittransaction': SmsDistributionCreditTransactionPane,
    'smsdistributioncredittransactions': SmsDistributionCreditTransactionsPane,
    'smsdistributionmessages': SmsDistributionMessagesPane,
    'smsdistributiontargets': SmsDistributionTargetsPane,
    'survey': SurveyPane,
    'surveyoutline': SurveyOutlinePane,
    'surveysubmission': SurveySubmissionPane,
    'timeline': PersonTimelinePane,
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
