import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonSelectWidget from '../misc/PersonSelectWidget';
import { getListItemById } from '../../utils/store';
import {
    retrieveSurveySubmission,
    updateSurveySubmission,
} from '../../actions/surveySubmission';


const mapStateToProps = (state, props) => ({
    submissionItem: getListItemById(
        state.surveySubmissions.submissionList,
        props.paneData.params[0]),
});


@injectIntl
@connect(mapStateToProps)
export default class LinkSubmissionPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            originalPersonId: null,
        };

        if (props.submissionItem && props.submissionItem.data) {
            let respondent = this.props.submissionItem.data.respondent;
            this.state.person = (respondent && respondent.id)?
                respondent : null;

            if (this.state.person) {
                this.state.originalPersonId = this.state.person.id;
            }
        }
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.linkSubmission.title' });
    }

    componentDidMount() {
        if (!this.props.submissionItem || !this.props.submissionItem.data) {
            this.props.dispatch(retrieveSurveySubmission(this.getParam(0)));
        }
    }

    componentWillReceiveProps(nextProps) {
        let sub = nextProps.submissionItem? nextProps.submissionItem.data : null;

        if (sub && sub.respondent && sub.respondent.id) {
            this.setState({
                originalPersonId: sub.respondent.id,
            });
        }
        else {
            this.setState({
                originalPersonId: null,
            });
        }
    }

    renderPaneContent(data) {
        let person = null;

        if (this.props.submissionItem && this.props.submissionItem.data) {
            return [
                <Msg key="instructions" tagName="p"
                    id="panes.linkSubmission.instructions"
                    />,
                <Msg key="person" tagName="h2"
                    id="panes.linkSubmission.person.h"
                    />,
                <PersonSelectWidget key="select"
                    person={ this.state.person }
                    onSelect={ this.onPersonSelect.bind(this) }
                    />,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    renderPaneFooter(data) {
        let personId = this.state.person? this.state.person.id : null;

        if (personId != this.state.originalPersonId) {
            let labelMsg = this.state.person?
                'panes.linkSubmission.saveButton.linkLabel' :
                'panes.linkSubmission.saveButton.unlinkLabel';

            return (
                <Button className="LinkSubmissionPane-saveButton"
                    labelMsg={ labelMsg }
                    onClick={ this.onSubmit.bind(this) }/>
            );
        }
        else {
            return null;
        }
    }

    onPersonSelect(person) {
        this.setState({
            person: person,
        });
    }

    onSubmit() {
        let surveyId = this.getParam(0);
        let paneId = this.props.paneData.id;
        let data = {
            respondent_id: this.state.person? this.state.person.id : null,
        };

        this.props.dispatch(updateSurveySubmission(surveyId, data, paneId));
    }
}
