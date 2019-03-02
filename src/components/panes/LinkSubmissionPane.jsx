import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import makeRandomString from '../../utils/makeRandomString';
import PaneBase from './PaneBase';
import PersonSelectWidget from '../misc/PersonSelectWidget';
import {
    beginSearch,
    clearSearch,
    resetSearchQuery,
    search,
} from '../../actions/search';
import { getListItemById } from '../../utils/store';
import {
    retrieveSurveySubmission,
    updateSurveySubmission,
} from '../../actions/surveySubmission';


const mapStateToProps = (state, props) => ({
    searchStore: state.search,
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
            suggestionSearchId: makeRandomString(),
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

        if (!this.state.person) {
            this.searchSuggestions();
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

    componentWillUnmount() {
        this.props.dispatch(clearSearch(this.state.suggestionSearchId));
    }

    renderPaneContent(data) {
        if (this.props.submissionItem && this.props.submissionItem.data) {
            const respondent = this.props.submissionItem.data.respondent;
            let actions = null;

            if (!this.state.person) {
                const content = [
                    <Msg key="suggestionsHeader" tagName="h2"
                        id="panes.linkSubmission.suggestions.h"
                        />,
                ];

                const searchData = this.props.searchStore[this.state.suggestionSearchId];
                if (searchData) {
                    if (searchData.isPending) {
                        content.push(
                            <LoadingIndicator key="loadingIndicator"/>,
                        );
                    }
                    else if (searchData.results && searchData.results.length) {
                        content.push(
                            <Msg key="foundSuggestions" tagName="p"
                                id="panes.linkSubmission.suggestions.found"
                                />,
                            <ul key="suggestions" className="LinkSubmissionPane-suggestionList">
                                {searchData.results.map(match => (
                                    <li key={match.data.id}
                                        className="LinkSubmissionPane-suggestion"
                                        onClick={this.onSuggestionClick.bind(this, match.data)}
                                        >
                                        <Avatar person={match.data}/>
                                        <div>
                                            <span className="LinkSubmissionPane-suggestionName">
                                                {`${match.data.first_name} ${match.data.last_name}`}
                                            </span>
                                            <span className="LinkSubmissionPane-suggestionEmail">
                                                {match.data.email}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                    }
                    else {
                        content.push(
                            <Msg key="noSuggestions" tagName="p"
                                id="panes.linkSubmission.suggestions.empty"
                                />,
                        );
                    }
                }

                if (respondent) {
                    content.push(
                        <Button key="createButton"
                            labelMsg="panes.linkSubmission.createButton"
                            labelValues={{
                                firstName: respondent.first_name,
                                lastName: respondent.last_name,
                            }}
                            onClick={ this.onCreateClick.bind(this) }
                            />,
                    );
                }
                else {
                    content.push(
                        <Button key="createButton"
                            labelMsg="panes.linkSubmission.createEmptyButton"
                            onClick={ this.onCreateClick.bind(this) }
                            />,
                    );
                }

                actions = (
                    <div key="actions" className="LinkSubmissionPane-actions">
                        {content}
                    </div>
                );
            }

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
                actions,
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

        if (!person) {
            this.searchSuggestions();
        }
    }

    searchSuggestions() {
        const subItem = this.props.submissionItem;
        if (!subItem || !subItem.data || !subItem.data.respondent) {
            return;
        }

        const email = subItem.data.respondent.email;

        if (email) {
            this.props.dispatch(beginSearch(this.state.suggestionSearchId, ['person']));
            this.props.dispatch(search(this.state.suggestionSearchId, email));
        }
    }

    onSuggestionClick(person) {
        this.setState({ person });
    }

    onCreateClick() {
        const subItem = this.props.submissionItem;
        if (subItem && subItem.data && subItem.data.respondent) {
            const respondent = subItem.data.respondent;
            this.openPane('addperson', respondent.first_name, respondent.last_name, respondent.email);
        }
        else {
            this.openPane('addperson');
        }
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
