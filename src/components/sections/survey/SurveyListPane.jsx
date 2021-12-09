import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import Button from '../../misc/Button';
import RootPaneBase from '../RootPaneBase';
import SurveyList from '../../lists/SurveyList';
import { retrieveSurveys } from '../../../actions/survey';


const mapStateToProps = state => {
    // FIXME: This is a temporary fix until a proper UI filter has been implemented
    const list = state.surveys.surveyList;
    const orgId = state.user.activeMembership.organization.id;
    list.items = list.items.filter(i => i.data.organization.id == orgId);
    return {
    surveyList: list,
}};


@connect(mapStateToProps)
@injectIntl
export default class SurveyListPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveSurveys())
    }

    renderPaneContent(data) {
        return (
            <SurveyList
                surveyList={ this.props.surveyList }
                onItemClick={ this.onItemClick.bind(this) }
                />
        );
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="SurveyListPane-addButton"
                labelMsg="panes.surveyList.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onAddClick() {
        this.openPane('addsurvey');
    }

    onItemClick(item, ev) {
        let survey = item.data;
        if (ev && ev.altKey) {
            this.openPane('editsurvey', survey.id);
        }
        else {
            this.openPane('survey', survey.id);
        }
    }
}
