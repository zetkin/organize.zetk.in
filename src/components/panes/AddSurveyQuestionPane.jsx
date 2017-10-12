import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import SurveyQuestionForm from '../forms/SurveyQuestionForm';
import { getListItemById } from '../../utils/store';
import { retrieveSurvey, createSurveyElement } from '../../actions/survey';


const mapStateToProps = (state, props) => ({
    surveyItem: getListItemById(state.surveys.surveyList,
        props.paneData.params[0]),
});


@connect(mapStateToProps)
@injectIntl
export default class AddSurveyQuestionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSurvey(this.getParam(0)));
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.addSurveyQuestion.title' });
    }

    renderPaneContent(data) {
        return [
            <SurveyQuestionForm key="form" ref="form"
                onSubmit={ this.onSubmit.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddSurveyQuestionPane-saveButton"
                labelMsg="panes.addSurveyQuestion.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let surveyId = this.getParam(0);
        let data = {
            type: 'question',
            question: this.refs.form.getValues(),
        };

        this.props.dispatch(createSurveyElement(surveyId, data,
            this.props.paneData.id));
    }
}
