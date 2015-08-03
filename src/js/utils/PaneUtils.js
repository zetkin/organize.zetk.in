import AddActivityPane from '../components/panes/AddActivityPane';
import AddPersonPane from '../components/panes/AddPersonPane';
import CampaignPane from '../components/panes/CampaignPane';
import EditActionPane from '../components/panes/EditActionPane';
import EditActivityPane from '../components/panes/EditActivityPane';
import LocationPane from '../components/panes/LocationPane';
import MoveParticipantsPane from '../components/panes/MoveParticipantsPane';
import PersonPane from '../components/panes/PersonPane';

var _panes = {
    'addactivity': AddActivityPane,
    'addperson': AddPersonPane,
    'campaign': CampaignPane,
    'editaction': EditActionPane,
    'editactivity': EditActivityPane,
    'location': LocationPane,
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
