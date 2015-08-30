import React from 'react/addons';

import SectionBase from '../SectionBase';
import CampaignLocationsPane from './CampaignLocationsPane';
import CampaignOverviewPane from './CampaignOverviewPane';
import CampaignPlaybackPane from './CampaignPlaybackPane';
import AllActionsPane from './AllActionsPane';


export default class CampaignSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'dashboard', title: 'Overview',
                startPane: CampaignOverviewPane },
            { path: 'actions', title: 'All actions',
                startPane: AllActionsPane },
            { path: 'locations', title: 'Locations',
                startPane: CampaignLocationsPane },
            { path: 'playback', title: 'Playback',
                startPane: CampaignPlaybackPane }
        ];
    }
}
