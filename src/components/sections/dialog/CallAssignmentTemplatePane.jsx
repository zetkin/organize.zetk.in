import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import RootPaneBase from '../RootPaneBase';
import StayInTouchTemplate from './templates/StayInTouchTemplate';
import InformTemplate from './templates/InformTemplate';
import MobilizeTemplate from './templates/MobilizeTemplate';
import SurveyTemplate from './templates/SurveyTemplate';
import { retrieveCampaigns } from '../../../actions/campaign';
import { createCallAssignmentDraft } from '../../../actions/callAssignment';


@connect(state => state)
export default class CallAssignmentTemplatePane extends RootPaneBase {
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
            <Msg key="header" tagName="h1"
                id="panes.callAssignmentTemplate.h"/>,
            <Msg key="instructions" tagName="p"
                id="panes.callAssignmentTemplate.instructions"/>,
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
        this.openPane('addcallassignment', action.payload.assignment.id);
    }
}
