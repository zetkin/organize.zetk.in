import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import SurveyTextBlockForm from '../forms/SurveyTextBlockForm';
import { getListItemById } from '../../utils/store';
import { retrieveSurvey, createSurveyElement } from '../../actions/survey';


const mapStateToProps = (state, props) => ({
    surveyItem: getListItemById(state.surveys.surveyList,
        props.paneData.params[0]),
});


@connect(mapStateToProps)
@injectIntl
export default class AddSurveyTextBlockPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSurvey(this.getParam(0)));
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.addSurveyTextBlock.title' });
    }

    renderPaneContent(data) {
        return [
            <SurveyTextBlockForm key="form" ref="form"
                onSubmit={ this.onSubmit.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddSurveyTextBlockPane-saveButton"
                labelMsg="panes.addSurveyTextBlock.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let surveyId = this.getParam(0);
        let data = {
            type: 'text',
            text_block: this.refs.form.getValues(),
        };

        this.props.dispatch(createSurveyElement(surveyId, data));
        this.closePane();
    }
}
