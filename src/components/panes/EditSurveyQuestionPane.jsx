import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import SurveyQuestionForm from '../forms/SurveyQuestionForm';
import SurveyQuestionOutline from '../misc/surveyOutline/SurveyQuestionOutline';
import { getListItemById } from '../../utils/store';
import {
    retrieveSurvey,
    updateSurveyElement,
    deleteSurveyElement,
    updateSurveyOption,
    createSurveyOption,
    createSurveyOptions,
    deleteSurveyOption,
    reorderSurveyOptions,
} from '../../actions/survey';


const mapStateToProps = (state, props) => {
    let elementList = state.surveys.elementsBySurvey[props.paneData.params[0]];
    let elementItem = null;

    if (elementList) {
        elementItem = getListItemById(elementList, props.paneData.params[1]);
    }

    return {
        elementItem,
        surveyItem: getListItemById(state.surveys.surveyList,
            props.paneData.params[0]),
    }
};


@connect(mapStateToProps)
@injectIntl
export default class EditSurveyQuestionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSurvey(this.getParam(0)));
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.editSurveyQuestion.title' });
    }

    renderPaneContent(data) {
        let elementItem = this.props.elementItem;
        if (elementItem && elementItem.data) {
            let question = elementItem.data.question;
            question.hidden = elementItem.data.hidden;

            let optionContainer = null;
            if (question.response_type == 'options' && question.options) {
                optionContainer = (
                    <div key="options">
                        <Msg tagName="h3" id="panes.editSurveyQuestion.options.h"/>
                        <SurveyQuestionOutline
                            options={ question.options }
                            onOptionCreate={ this.onOptionCreate.bind(this) }
                            onOptionsCreate={ this.onOptionsCreate.bind(this) }
                            onOptionTextChange={ this.onOptionTextChange.bind(this) }
                            onOptionDelete={ this.onOptionDelete.bind(this) }
                            onReorder={ this.onOptionReorder.bind(this) }
                            />
                    </div>
                );
            }

            return [
                <SurveyQuestionForm key="form" ref="form"
                    question={ question }
                    onSubmit={ this.onSubmit.bind(this) }/>,

                <DeleteButton key="deleteButton"
                    onClick={ this.onDeleteClick.bind(this) }/>,

                optionContainer,
            ];
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditSurveyQuestionPane-saveButton"
                labelMsg="panes.editSurveyQuestion.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onOptionTextChange(option, text) {
        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);
        let data = { text };

        this.props.dispatch(updateSurveyOption(
            surveyId, elementId, option.id, data));
    }

    onOptionDelete(option) {
        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);

        this.props.dispatch(deleteSurveyOption(
            surveyId, elementId, option.id));
    }

    onOptionCreate(text) {
        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);
        let data = { text };

        this.props.dispatch(createSurveyOption(
            surveyId, elementId, data));
    }

    onOptionsCreate(lines) {
        const surveyId = this.getParam(0);
        const elementId = this.getParam(1);
        const options = lines.map(text => ({ text }));

        this.props.dispatch(createSurveyOptions(
            surveyId, elementId, options));
    }

    onOptionReorder(order) {
        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);

        this.props.dispatch(reorderSurveyOptions(
            surveyId, elementId, order));
    }

    onSubmit(ev) {
        ev.preventDefault();

        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);
        const data = {
            question: this.refs.form.getChangedValues(),
        };

        if ('hidden' in data.question) {
            data.hidden = data.question.hidden == 'hidden';
            delete data.question.hidden;
        }

        this.props.dispatch(updateSurveyElement(surveyId, elementId, data));
        this.closePane();
    }

    onDeleteClick() {
        let surveyId = this.getParam(0);
        let elemId = this.getParam(1)

        this.props.dispatch(deleteSurveyElement(surveyId, elemId));
        this.closePane();
    }
}
