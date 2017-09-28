import ActionDistributionPane from './campaign/ActionDistributionPane';
import AllActionsPane from './campaign/AllActionsPane';
import AllCallAssignmentsPane from './dialog/AllCallAssignmentsPane';
import AllCanvassAssignmentsPane from './canvass/AllCanvassAssignmentsPane';
import AllRoutesPane from './canvass/AllRoutesPane';
import AllVisitsPane from './canvass/AllVisitsPane';
import CallLogPane from './dialog/CallLogPane';
import CampaignPlaybackPane from './campaign/CampaignPlaybackPane';
import InvitePane from './people/InvitePane';
import ImportPane from './people/ImportPane';
import LocationsPane from './maps/LocationsPane';
import MapOverviewPane from './maps/MapOverviewPane';
import OfficialsPane from './settings/OfficialsPane';
import PeopleListPane from './people/PeopleListPane';
import SurveyListPane from './survey/SurveyListPane';
import SurveySubmissionsPane from './survey/SurveySubmissionsPane';


export const SECTIONS = {
    people: {
        subSections: [
            { path: 'list',
                startPane: PeopleListPane },
            { path: 'invite',
                startPane: InvitePane },
            { path: 'import',
                startPane: ImportPane },
        ],
    },
    campaign: {
        subSections: [
            { path: 'actions',
                startPane: AllActionsPane },
            { path: 'distribution',
                startPane: ActionDistributionPane },
            { path: 'playback',
                startPane: CampaignPlaybackPane }
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


