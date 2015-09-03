import ActionDayPane from './ActionDayPane';
import AddActionPane from './AddActionPane';
import AddActivityPane from './AddActivityPane';
import AddCampaignPane from './AddCampaignPane';
import AddPersonPane from './AddPersonPane';
import AddLocationPane from './AddLocationPane';
import AddLocationWithMapPane from './AddLocationWithMapPane';
import CampaignPane from './CampaignPane';
import EditActionPane from './EditActionPane';
import EditActivityPane from './EditActivityPane';
import EditCampaignPane from './EditCampaignPane';
import EditLocationPane from './EditLocationPane';
import EditQueryPane from './EditQueryPane';
import MoveParticipantsPane from './MoveParticipantsPane';
import PersonPane from './PersonPane';
import QueryPane from './QueryPane';

var _panes = {
    'actionday': ActionDayPane,
    'addaction': AddActionPane,
    'addactivity': AddActivityPane,
    'addperson': AddPersonPane,
    'addcampaign': AddCampaignPane,
    'addlocationwithmap': AddLocationWithMapPane,
    'addlocation': AddLocationPane,
    'campaign': CampaignPane,
    'editaction': EditActionPane,
    'editactivity': EditActivityPane,
    'editcampaign': EditCampaignPane,
    'editlocation': EditLocationPane,
    'editquery': EditQueryPane,
    'location': EditLocationPane,
    'moveparticipants': MoveParticipantsPane,
    'person': PersonPane,
    'query': QueryPane
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
