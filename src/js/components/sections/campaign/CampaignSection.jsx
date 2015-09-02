import React from 'react/addons';

import SectionBase from '../SectionBase';
import ActionDistributionPane from './ActionDistributionPane';
import AllActionsPane from './AllActionsPane';
import CampaignOverviewPane from './CampaignOverviewPane';
import CampaignPlaybackPane from './CampaignPlaybackPane';


export default class CampaignSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'dashboard', title: 'Overview',
                startPane: CampaignOverviewPane },
            { path: 'actions', title: 'All actions',
                startPane: AllActionsPane },
            { path: 'distribution', title: 'Distribution',
                startPane: ActionDistributionPane },
            { path: 'playback', title: 'Playback',
                startPane: CampaignPlaybackPane }
        ];
    }
}
