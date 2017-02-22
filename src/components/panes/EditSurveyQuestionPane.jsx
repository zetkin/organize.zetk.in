import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import SurveyQuestionForm from '../forms/SurveyQuestionForm';
import { getListItemById } from '../../utils/store';
import { retrieveSurvey, updateSurveyElement } from '../../actions/survey';


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

            return [
                <SurveyQuestionForm key="form" ref="form"
                    question={ question }
                    onSubmit={ this.onSubmit.bind(this) }/>,
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

    onSubmit(ev) {
        ev.preventDefault();

        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);
        let data = {
            question: this.refs.form.getChangedValues(),
        };

        this.props.dispatch(updateSurveyElement(surveyId, elementId, data));
        this.closePane();
    }
}
