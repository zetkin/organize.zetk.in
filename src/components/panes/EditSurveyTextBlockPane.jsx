import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import SurveyTextBlockForm from '../forms/SurveyTextBlockForm';
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
export default class EditSurveyTextBlockPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveSurvey(this.getParam(0)));
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.editSurveyTextBlock.title' });
    }

    renderPaneContent(data) {
        let elementItem = this.props.elementItem;
        if (elementItem && elementItem.data) {
            let textBlock = elementItem.data.text_block;

            return [
                <SurveyTextBlockForm key="form" ref="form"
                    textBlock={ textBlock }
                    onSubmit={ this.onSubmit.bind(this) }/>,
            ];
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditSurveyTextBlockPane-saveButton"
                labelMsg="panes.editSurveyTextBlock.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let surveyId = this.getParam(0);
        let elementId = this.getParam(1);
        let data = {
            text_block: this.refs.form.getChangedValues(),
        };

        this.props.dispatch(updateSurveyElement(surveyId, elementId, data));
        this.closePane();
    }
}
