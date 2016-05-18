import ActionDayPane from './ActionDayPane';
import ActionReminderPane from './ActionReminderPane';
import AddActionPane from './AddActionPane';
import AddActivityPane from './AddActivityPane';
import AddCampaignPane from './AddCampaignPane';
import AddPersonPane from './AddPersonPane';
import AddLocationPane from './AddLocationPane';
import AddLocationWithMapPane from './AddLocationWithMapPane';
import CallAssignmentPane from './CallAssignmentPane';
import CampaignPane from './CampaignPane';
import EditActionPane from './EditActionPane';
import EditActivityPane from './EditActivityPane';
import EditCallAssignmentPane from './EditCallAssignmentPane';
import EditCallerPane from './EditCallerPane';
import EditCampaignPane from './EditCampaignPane';
import EditLocationPane from './EditLocationPane';
import EditLocationWithMapPane from './EditLocationWithMapPane';
import EditTextPane from './EditTextPane';
import EditQueryPane from './EditQueryPane';
import MoveParticipantsPane from './MoveParticipantsPane';
import PersonPane from './PersonPane';
import QueryPane from './QueryPane';
import SelectPeoplePane from './SelectPeoplePane';
import SelectPersonTagsPane from './SelectPersonTagsPane';

var _panes = {
    'actionday': ActionDayPane,
    'addaction': AddActionPane,
    'addactivity': AddActivityPane,
    'addperson': AddPersonPane,
    'addcampaign': AddCampaignPane,
    'addlocationwithmap': AddLocationWithMapPane,
    'addlocation': AddLocationPane,
    'callassignment': CallAssignmentPane,
    'campaign': CampaignPane,
    'editaction': EditActionPane,
    'editactivity': EditActivityPane,
    'editcallassignment': EditCallAssignmentPane,
    'editcaller': EditCallerPane,
    'editcampaign': EditCampaignPane,
    'editlocation': EditLocationPane,
    'editlocationwithmap': EditLocationWithMapPane,
    'editquery': EditQueryPane,
    'edittext': EditTextPane,
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
