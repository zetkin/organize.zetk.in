import ActionDayPane from '../components/panes/ActionDayPane';
import AddActionPane from '../components/panes/AddActionPane';
import AddActivityPane from '../components/panes/AddActivityPane';
import AddCampaignPane from '../components/panes/AddCampaignPane';
import AddPersonPane from '../components/panes/AddPersonPane';
import AddLocationPane from '../components/panes/AddLocationPane';
import AddLocationWithMapPane from '../components/panes/AddLocationWithMapPane';
import CampaignPane from '../components/panes/CampaignPane';
import EditActionPane from '../components/panes/EditActionPane';
import EditActivityPane from '../components/panes/EditActivityPane';
import EditCampaignPane from '../components/panes/EditCampaignPane';
import EditLocationPane from '../components/panes/EditLocationPane';
import EditQueryPane from '../components/panes/EditQueryPane';
import MoveParticipantsPane from '../components/panes/MoveParticipantsPane';
import PersonPane from '../components/panes/PersonPane';

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
    'person': PersonPane
};

function resolve(name) {
    if (name in _panes) {
        return _panes[name];
    }
    else {
        return null;
    }
}

export default {
    resolve: resolve
};
