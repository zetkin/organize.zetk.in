import React from 'react';
import { injectIntl, FormattedDate, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { retrieveSurvey } from '../../actions/survey';
import { retrieveSurveySubmission } from '../../actions/surveySubmission';
import hasData from '../../utils/hasData';


const mapStateToProps = (state, props) => {
    let submissionItem = getListItemById(
        state.surveySubmissions.submissionList,
        props.paneData.params[0]);

    let surveyItem = null;
    let elementList = null;
    if (submissionItem && submissionItem.data && submissionItem.data.survey) {
        surveyItem = getListItemById(
            state.surveys.surveyList, submissionItem.data.survey.id);

        if (surveyItem && surveyItem.data) {
            elementList = state.surveys.elementsBySurvey[surveyItem.data.id];
        }
    }

    return { submissionItem, surveyItem, elementList };
};


@connect(mapStateToProps)
@injectIntl
export default class SurveySubmissionPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let subItem = this.props.submissionItem;

        this.props.dispatch(retrieveSurveySubmission(this.getParam(0)));

        if (subItem && subItem.data && subItem.data.survey) {
            this.props.dispatch(retrieveSurvey(subItem.data.survey.id));
        }
    }

    getRenderData() {
        return {
            submissionItem: this.props.submissionItem,
            surveyItem: this.props.surveyItem,
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        if (data.submissionItem && !data.submissionItem.isPending) {
            return formatMessage({ id: 'panes.surveySubmission.title' });
        }
        else {
            return null;
        }
    }

    componentWillReceiveProps(nextProps) {
        let subItem = nextProps.submissionItem;

        // Can't load survey until we know which one to load
        if (!hasData(subItem, ['data', 'survey', 'id']))
            return;

        // Shouldn't load survey if it already exists
        if (nextProps.elementList)
            return;

        // Shouldn't load if already loading
        if (nextProps.surveyItem && nextProps.surveyItem.isPending)
            return;

        this.props.dispatch(retrieveSurvey(subItem.data.survey.id));
    }

    renderPaneContent(data) {
        if (data.submissionItem && !data.submissionItem.isPending) {
            let sub = data.submissionItem.data;
            let survey = data.surveyItem? data.surveyItem.data : null;

            let timestamp = Date.create(sub.submitted);

            let responses = <LoadingIndicator />;
            if (this.props.elementList) {
                responses = this.props.elementList.items
                    .map(i => i.data)
                    .filter(element => element.type == 'question')
                    .map(element => {
                        let response = null;

                        if (this.props.submissionItem.data.responses) {
                            response = this.props.submissionItem.data.responses
                                .find(r => r.question_id == element.id);
                        }

                        return (
                            <SubmissionResponse key={ element.id }
                                question={ element.question }
                                response={ response }
                                />
                        );
                    });
            }

            return [
                <div key="info" className="SurveySubmissionPane-info">
                    <p className="SurveySubmissionPane-infoSurvey">
                        { sub.survey.title }</p>
                    <p className="SurveySubmissionPane-infoDate">
                        <FormattedDate value={ timestamp }
                            year="numeric" month="short" day="numeric"
                            hour="2-digit" minute="2-digit"
                            />
                    </p>

                    <SubmissionRespondent submission={ sub }
                        onConnect={ this.onConnectClick.bind(this) }
                        onAvatarClick={ this.onAvatarClick.bind(this) }/>
                </div>,
                <div key="responses" className="SurveySubmissionPane-responses">
                    <Msg tagName="h3" id="panes.surveySubmission.responses.h"/>
                    { responses }
                </div>
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onConnectClick() {
        let surveyId = this.getParam(0);
        this.openPane('linksubmission', surveyId);
    }

    onAvatarClick(person) {
        this.openPane('person', person.id);
    }
}


let SubmissionRespondent = props => {
    let sub = props.submission;

    let name = <Msg id="panes.surveySubmission.info.anonymous"/>;
    let avatar = (
        <div className="SurveySubmissionPane-unknown"/>
    );
    let email = null;
    let connection = null;

    if (sub.respondent) {
        name = sub.respondent.first_name + ' ' + sub.respondent.last_name;

        email = (
            <span className ="SurveySubmissionPane-email">
                { sub.respondent.email }</span>
        );

        if (sub.respondent.id) {

            avatar = <Avatar person={ sub.respondent } onClick={ (ev) => props.onAvatarClick(sub.respondent) }/>;
            connection = (
                <div className="SurveySubmissionPane-connection connected"
                    onClick={ props.onConnect }>
                    <Msg id="panes.surveySubmission.info.connected"/>
                </div>
            );
        }
        else {
            connection = (
                <div className="SurveySubmissionPane-connection"
                    onClick={ props.onConnect }>
                    <Msg id="panes.surveySubmission.info.notConnected"/>
                </div>
            );
        }
    }
    else {
        connection = (
            <div className="SurveySubmissionPane-connection"
                onClick={ props.onConnect }>
                <Msg id="panes.surveySubmission.info.notConnected"/>
            </div>
        );
    }

    let classes = cx('SurveySubmissionPane-respondent', {
        anonymous: !sub.respondent,
    });

    return (
        <div className={ classes }>
            <div className="SurveySubmissionPane-signed">
                { avatar }
                <div className="SurveySubmissionPane-respondentInfo">
                    <span className="SurveySubmissionPane-name">
                        { name }
                    </span>
                    { email }
                </div>
            </div>
            { connection }
        </div>
    );
};

let SubmissionResponse = props => {
    let responseContent;

    if (props.response) {
        responseContent = [];

        if (props.response.options && props.response.options.length) {
            let optionItems = (props.response.options || []).map(oid => {
                let qo = props.question.options.find(o => o.id == oid);

                return (
                    <li key={ oid }>{ qo.text }</li>
                );
            });

            responseContent.push(
                <ul key="options"
                    className="SurveySubmissionPane-responseOptions">
                    { optionItems }
                </ul>
            );
        }

        if (props.response.response && props.response.response.length) {
            responseContent.push(
                <span key="text"
                    className="SurveySubmissionPane-responseText">
                    { props.response.response }
                </span>
            );
        }
    }
    else {
        responseContent = (
            <div className="SurveySubmissionPane-responseEmpty">
                <Msg id="panes.surveySubmission.responses.emptyResponse"/>
            </div>
        );
    }

    return (
        <div className="SurveySubmissionPane-response">
            <h4>{ props.question.question }</h4>
            { responseContent }
        </div>
    );
}
