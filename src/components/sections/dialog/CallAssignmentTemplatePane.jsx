import React from 'react';
import { connect } from 'react-redux';

import PaneBase from '../../panes/PaneBase';
import StayInTouchTemplate from './templates/StayInTouchTemplate';
import InformTemplate from './templates/InformTemplate';
import MobilizeTemplate from './templates/MobilizeTemplate';
import SurveyTemplate from './templates/SurveyTemplate';
import { retrieveCampaigns } from '../../../actions/campaign';
import { createCallAssignmentDraft } from '../../../actions/callAssignment';


@connect(state => state)
export default class CallAssignmentTemplatePane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveCampaigns());
    }

    getRenderData() {
        let campaignList = this.props.campaigns.campaignList;

        return {
            campaigns: campaignList.items.map(i => i.data)
        };
    }

    renderPaneContent(data) {
        return [
            <h1 key="header">Create call assignment from template</h1>,
            <p key="instructions">
                Select a template and configure it to get started.
            </p>,
            <div key="templates"
                className="CallAssignmentTemplatePane-templates">
                <StayInTouchTemplate onCreate={ this.onCreate.bind(this) }/>
                <InformTemplate onCreate={ this.onCreate.bind(this) }/>
                <MobilizeTemplate campaigns={ data.campaigns }
                    onCreate={ this.onCreate.bind(this) }/>
                <SurveyTemplate onCreate={ this.onCreate.bind(this) }/>
            </div>
        ];
    }

    onCreate(type, values) {
        let action = createCallAssignmentDraft(type, values);
        this.props.dispatch(action);
        this.openPane('callassignment', action.payload.assignment.id);
    }
}
