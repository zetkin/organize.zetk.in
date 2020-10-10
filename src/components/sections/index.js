import ActionDistributionPane from './campaign/ActionDistributionPane';
import AllActionsPane from './campaign/AllActionsPane';
import AllCallAssignmentsPane from './dialog/AllCallAssignmentsPane';
import AllCampaignsPane from './campaign/AllCampaignsPane';
import AllCanvassAssignmentsPane from './canvass/AllCanvassAssignmentsPane';
import AllRoutesPane from './canvass/AllRoutesPane';
import AllVisitsPane from './canvass/AllVisitsPane';
import CallLogPane from './dialog/CallLogPane';
import CampaignPlaybackPane from './campaign/CampaignPlaybackPane';
import GroupListPane from './people/GroupListPane';
import InvitePane from './people/InvitePane';
import ImportPane from './people/ImportPane';
import LocationsPane from './maps/LocationsPane';
import ManagePeoplePane from './people/ManagePeoplePane';
import MapOverviewPane from './maps/MapOverviewPane';
import OfficialsPane from './settings/OfficialsPane';
import PeopleListPane from './people/PeopleListPane';
import PersonViewsPane from './people/PersonViewsPane';
import SurveyListPane from './survey/SurveyListPane';
import SurveySubmissionsPane from './survey/SurveySubmissionsPane';


export const SECTIONS = {
    people: {
        subSections: [
            { path: 'list',
                startPane: PeopleListPane },
            { path: 'views',
                startPane: PersonViewsPane },
            { path: 'import',
                startPane: ImportPane },
            { path: 'groups',
                startPane: GroupListPane },
            { path: 'manage',
                startPane: ManagePeoplePane },
        ],
    },
    campaign: {
        subSections: [
            { path: 'actions',
                startPane: AllActionsPane },
            { path: 'distribution',
                startPane: ActionDistributionPane },
            { path: 'playback',
                startPane: CampaignPlaybackPane },
            { path: 'campaigns',
                startPane: AllCampaignsPane }
        ],
    },
    dialog: {
        subSections: [
            { path: 'assignments',
                startPane: AllCallAssignmentsPane },
            { path: 'calls',
                startPane: CallLogPane },
        ],
    },
    maps: {
        subSections: [
            { path: 'overview',
                startPane: MapOverviewPane },
            { path: 'locations',
                startPane: LocationsPane },
        ],
    },
    survey: {
        subSections: [
            { path: 'surveys',
                startPane: SurveyListPane },
            { path: 'submissions',
                startPane: SurveySubmissionsPane },
        ],
    },
    canvass: {
        subSections: [
            { path: 'assignments',
                startPane: AllCanvassAssignmentsPane },
            { path: 'routes',
                startPane: AllRoutesPane },
            { path: 'visits',
                startPane: AllVisitsPane },
        ],
    },
    settings: {
        subSections: [
            { path: 'officials',
                startPane: OfficialsPane },
        ],
    },
};


