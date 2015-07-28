import React from 'react/addons';

import SectionBase from '../SectionBase';
import CampaignListPane from './CampaignListPane';
import CampaignOverviewPane from './CampaignOverviewPane';
import CampaignPlannerPane from './CampaignPlannerPane';


export default class CampaignSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'dashboard', title: 'Overview',
                startPane: CampaignOverviewPane },
            { path: 'planner', title: 'Planner',
                startPane: CampaignPlannerPane },
            { path: 'campaigns', title: 'All campaigns',
                startPane: CampaignListPane }
        ];
    }
}
