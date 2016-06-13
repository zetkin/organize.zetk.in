import ActionDistributionPane from './campaign/ActionDistributionPane';
import AllActionsPane from './campaign/AllActionsPane';
import CampaignPlaybackPane from './campaign/CampaignPlaybackPane';
import AllCallAssignmentsPane from './dialog/AllCallAssignmentsPane';
import CallAssignmentTemplatePane from './dialog/CallAssignmentTemplatePane';
import CallLogPane from './dialog/CallLogPane';
import PeopleListPane from './people/PeopleListPane';
import JoinRequestsPane from './people/JoinRequestsPane';
import InvitePane from './people/InvitePane';
import LocationsPane from './maps/LocationsPane';


export const SECTIONS = {
    people: {
        title: 'People',
        subSections: [
            { path: 'list', title: 'People',
                startPane: PeopleListPane },
            { path: 'requests', title: 'Join requests',
                startPane: JoinRequestsPane },
            { path: 'invite', title: 'Invite',
                startPane: InvitePane },
        ],
    },
    campaign: {
        title: 'Campaign',
        subSections: [
            { path: 'actions', title: 'All actions',
                startPane: AllActionsPane },
            { path: 'distribution', title: 'Distribution',
                startPane: ActionDistributionPane },
            { path: 'playback', title: 'Playback',
                startPane: CampaignPlaybackPane }
        ],
    },
    dialog: {
        title: 'Dialog',
        subSections: [
            { path: 'assignments', title: 'Assignments',
                startPane: AllCallAssignmentsPane },
            { path: 'calls', title: 'Call log',
                startPane: CallLogPane },
            { path: 'startassignment', title: 'Assignment templates',
                startPane: CallAssignmentTemplatePane },
        ],
    },
    maps: {
        title: 'Maps',
        subSections: [
            { path: 'locations', title: 'Locations',
                startPane: LocationsPane }
        ],
    }
};


