import React from 'react/addons';

import SectionBase from '../SectionBase';
import CampaignLocationsPane from './CampaignLocationsPane';
import CampaignOverviewPane from './CampaignOverviewPane';
import CampaignPlannerPane from './CampaignPlannerPane';
import CampaignPlaybackPane from './CampaignPlaybackPane';
import AllActivitiesPane from './AllActivitiesPane';
import AllActionsPane from './AllActionsPane';


export default class CampaignSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'dashboard', title: 'Overview',
                startPane: CampaignOverviewPane },
            { path: 'actions', title: 'All actions',
                startPane: AllActionsPane },
            { path: 'playback', title: 'Playback',
                startPane: CampaignPlaybackPane },
            { path: 'locations', title: 'Campaign locations',
                startPane: CampaignLocationsPane },
            { path: 'activities', title: 'Activities',
                startPane: AllActivitiesPane },
            { path: 'planner', title: 'Planner',
                startPane: CampaignPlannerPane }
        ];
    }
}
