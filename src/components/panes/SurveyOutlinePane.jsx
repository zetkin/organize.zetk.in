import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Link from '../misc/Link';
import LoadingIndicator from '../misc/LoadingIndicator';
import SurveyOutline from '../misc/surveyOutline/SurveyOutline';
import { getListItemById } from '../../utils/store';
import { retrieveSurvey } from '../../actions/survey';


const mapStateToProps = (state, props) => ({
    elementList: state.surveys.elementsBySurvey[props.paneData.params[0]],
    surveyItem: getListItemById(state.surveys.surveyList,
        props.paneData.params[0]),
});


@connect(mapStateToProps)
@injectIntl
export default class SurveyOutlinePane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let surveyItem = this.props.surveyItem;
        if (!surveyItem || !surveyItem.data || !surveyItem.data.elements) {
            this.props.dispatch(retrieveSurvey(this.getParam(0)));
        }
    }

    getPaneTitle(data) {
        let surveyItem = this.props.surveyItem;
        if (surveyItem && surveyItem.data && !surveyItem.isPending) {
            return this.props.intl.formatMessage(
                { id: 'panes.surveyOutline.title' },
                { survey: this.props.surveyItem.data.title });
        }
        else {
            return this.props.intl.formatMessage(
                { id: 'panes.surveyOutline.pendingTitle' });
        }
    }

    renderPaneContent(data) {
        let surveyItem = this.props.surveyItem;
        let elementList = this.props.elementList;
        if (surveyItem && surveyItem.data && elementList) {
            let survey = surveyItem.data;
            let elements = elementList.items.map(i => i.data);

            return [
                <div key="elements"
                    className="SurveyOutlinePane-elements">
                    <SurveyOutline survey={ survey }
                        elements={ elements }
                        onElementSelect={ this.onElementSelect.bind(this) }
                        />
                </div>,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onElementSelect(element) {
        let survey = this.props.surveyItem.data;

        if (element.type == 'question') {
            this.openPane('editsurveyquestion', survey.id, element.id);
        }
        else if (element.type == 'text') {
            this.openPane('editsurveytextblock', survey.id, element.id);
        }
    }
}
