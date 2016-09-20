import ActionDayPane from './ActionDayPane';
import ActionReminderPane from './ActionReminderPane';
import AddActionPane from './AddActionPane';
import AddActivityPane from './AddActivityPane';
import AddCallAssignmentPane from './AddCallAssignmentPane';
import AddCampaignPane from './AddCampaignPane';
import AddPersonPane from './AddPersonPane';
import AddPersonTagPane from './AddPersonTagPane';
import AddLocationPane from './AddLocationPane';
import AddLocationWithMapPane from './AddLocationWithMapPane';
import CallPane from './CallPane';
import CallAssignmentPane from './CallAssignmentPane';
import CampaignPane from './CampaignPane';
import EditActionPane from './EditActionPane';
import EditActivityPane from './EditActivityPane';
import EditCallAssignmentPane from './EditCallAssignmentPane';
import EditCallerPane from './EditCallerPane';
import EditCampaignPane from './EditCampaignPane';
import EditLocationPane from './EditLocationPane';
import EditLocationWithMapPane from './EditLocationWithMapPane';
import EditPersonPane from './EditPersonPane';
import EditPersonTagPane from './EditPersonTagPane';
import EditTextPane from './EditTextPane';
import EditQueryPane from './EditQueryPane';
import ImporterColumnPane from './ImporterColumnPane';
import MoveParticipantsPane from './MoveParticipantsPane';
import PersonPane from './PersonPane';
import QueryPane from './QueryPane';
import SelectPeoplePane from './SelectPeoplePane';
import SelectPersonTagsPane from './SelectPersonTagsPane';

var _panes = {
    'actionday': ActionDayPane,
    'addaction': AddActionPane,
    'addactivity': AddActivityPane,
    'addcallassignment': AddCallAssignmentPane,
    'addcampaign': AddCampaignPane,
    'addlocationwithmap': AddLocationWithMapPane,
    'addlocation': AddLocationPane,
    'addperson': AddPersonPane,
    'addpersontag': AddPersonTagPane,
    'call': CallPane,
    'callassignment': CallAssignmentPane,
    'campaign': CampaignPane,
    'editaction': EditActionPane,
    'editactivity': EditActivityPane,
    'editcallassignment': EditCallAssignmentPane,
    'editcaller': EditCallerPane,
    'editcampaign': EditCampaignPane,
    'editlocation': EditLocationPane,
    'editlocationwithmap': EditLocationWithMapPane,
    'editperson': EditPersonPane,
    'editpersontag': EditPersonTagPane,
    'editquery': EditQueryPane,
    'edittext': EditTextPane,
    'importercolumn': ImporterColumnPane,
    'location': EditLocationPane,
    'moveparticipants': MoveParticipantsPane,
    'person': PersonPane,
    'query': QueryPane,
    'reminder': ActionReminderPane,
    'selectpeople': SelectPeoplePane,
    'selectpersontags': SelectPersonTagsPane,
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
