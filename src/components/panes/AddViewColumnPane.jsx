import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import AssignmentTemplate from '../misc/callAssignmentTemplates/AssignmentTemplate';
import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import PersonViewColumnForm from '../forms/PersonViewColumnForm';
import SelectInput from '../forms/inputs/SelectInput';
import { createPersonViewColumn } from '../../actions/personView';
import { retrievePersonTags } from '../../actions/personTag';
import { retrieveQueries } from '../../actions/query';
import { retrieveSurveys, retrieveSurvey } from '../../actions/survey';


const DEFAULT_CONFIGS = {
    person_field: {
        field: 'email',
    },
    person_query: {
        query_id: null,
    },
    person_tag: {
        tag_id: null,
    },
    survey_response: {
        survey_id: null,
        question_id: null,
    }
};


@connect(state => ({
    queryList: state.queries.queryList,
    surveyList: state.surveys.surveyList,
    tagList: state.personTags.tagList,
}))
@injectIntl
export default class AddViewColumnPane extends PaneBase {
    constructor(props) {
        super(props);

        const shouldShowButton = Boolean(true)
        this.state = {
            type: 'person_field',
            config: Object.assign({}, DEFAULT_CONFIGS.person_field),
            shouldShowButton: shouldShowButton,
        };
    }

    componentDidMount() {
        this.props.dispatch(retrievePersonTags());
        this.props.dispatch(retrieveQueries());
        this.props.dispatch(retrieveSurveys());
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.addViewColumn.title' });
    }

    renderPaneContent(data) {
        return [
            <PersonFieldColumnTemplate key="person_field"
                config={ this.state.config }
                selected={ this.state.type == 'person_field' }
                onChange={ column => this.setState(column) }
                onSelect={ this.onTypeSelect.bind(this) }/>,
            <PersonTagColumnTemplate key="person_tag"
                tagList={ this.props.tagList }
                config={ this.state.config }
                selected={ this.state.type == 'person_tag' }
                onChange={ column => this.setState(column) }
                onSelect={ this.onTypeSelect.bind(this) }/>,
            <PersonQueryColumnTemplate key="person_query"
                queryList={ this.props.queryList }
                config={ this.state.config }
                selected={ this.state.type == 'person_query' }
                onChange={ column => this.setState(column) }
                onSelect={ this.onTypeSelect.bind(this) }/>,
            <SurveyResponseColumnTemplate key="survey_response"
                surveyList={ this.props.surveyList }
                config={ this.state.config }
                selected={ this.state.type == 'survey_response' }
                onChange={ column => this.setState(column) }
                onSelect={ this.onTypeSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        if (this.state.shouldShowButton) {
            return (
                <Button
                    labelMsg="panes.addViewColumn.saveButton"
                    onClick={this.onSubmit.bind(this)}
                    className="AddPersonTagPane-saveButton"/>
            );
        } else {
            return null;
        }
    }

    onTypeSelect(type) {
        const config = Object.assign({}, DEFAULT_CONFIGS[type]);
        if (type === "survey_response") {
            this.setState({ type, config, shouldShowButton: false});
        } else {
            this.setState({ type, config });
        }
    }

    onSubmit(ev) {
        ev.preventDefault();

        const viewId = this.getParam(0);
        const values = {
            title: this.state.title,
            type: this.state.type,
            config: this.state.config,
        };
        this.props.dispatch(createPersonViewColumn(viewId, values));
        this.closePane();
    }
}


@injectIntl
class PersonFieldColumnTemplate extends React.Component {
    componentDidMount() {
        this.onConfigChange('field', this.props.config.field);
    }

    componentDidUpdate(prevProps) {
        if (this.props.selected && !prevProps.selected) {
            this.onConfigChange('field', this.props.config.field);
        }
    }

    render() {
        const props = this.props;

        const FIELDS = [
            'ext_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'alt_phone',
            'co_address',
            'street_address',
            'zip_code',
            'city',
            'country',
        ];

        const fieldOptions = FIELDS.reduce((options, field) => {
            options[field] = props.intl.formatMessage(
                { id: `panes.addViewColumn.config.personField.fieldOptions.${field}` });
            return options;
        }, {});

        return (
            <AssignmentTemplate type="person_field"
                messagePath="panes.addViewColumn.templates"
                selected={ props.selected }
                onSelect={ props.onSelect }
                >
                <SelectInput name="field"
                    labelMsg="panes.addViewColumn.config.personField.field"
                    options={ fieldOptions }
                    value={ props.config.field }
                    onValueChange={ this.onConfigChange.bind(this) }
                    />
            </AssignmentTemplate>
        );
    }

    onConfigChange(attr, val) {
        const column = {
            config: Object.assign({}, this.props.config, {
                [attr]: val,
            })
        };

        const field = column.config.field;
        column.title = this.props.intl.formatMessage(
            { id: `panes.addViewColumn.config.personField.fieldOptions.${field}` });

        this.props.onChange(column);
    }
}

class PersonQueryColumnTemplate extends React.Component {
    componentDidUpdate(prevProps) {
        // When selected, pick the first query and propagate config
        if (this.props.selected && !prevProps.selected) {
            const { queryList } = this.props;

            if (queryList && queryList.items && queryList.items.length) {
                this.onConfigChange('query_id', queryList.items[0].data.id);
            }
        }
    }

    render() {
        const props = this.props;

        let queryOptions = [];

        if (props.queryList && props.queryList.items) {
            queryOptions = props.queryList.items.reduce((options, item) => {
                // Exclude queries without title, e.g. call assignment queries
                if (item.data.title) {
                    options[item.data.id] = item.data.title;
                }

                return options;
            }, {});
        }

        return (
            <AssignmentTemplate type="person_query"
                messagePath="panes.addViewColumn.templates"
                selected={ props.selected }
                onSelect={ props.onSelect }
                >
                <SelectInput name="query_id"
                    labelMsg="panes.addViewColumn.config.personQuery.query"
                    options={ queryOptions }
                    value={ props.config.query_id }
                    onValueChange={ this.onConfigChange.bind(this) }
                    />
            </AssignmentTemplate>
        );
    }

    onConfigChange(attr, val) {
        const column = {
            config: Object.assign({}, this.props.config, {
                [attr]: val,
            })
        };

        const selectedQueryItem = this.props.queryList.items
            .find(item => item.data.id == column.config.query_id);

        column.title = selectedQueryItem.data.title;

        this.props.onChange(column);
    }
}

class PersonTagColumnTemplate extends React.Component {
    componentDidUpdate(prevProps) {
        // When selected, pick the first tag and propagate config
        if (this.props.selected && !prevProps.selected) {
            const { tagList } = this.props;

            if (tagList && tagList.items && tagList.items.length) {
                this.onConfigChange('tag_id', tagList.items[0].data.id);
            }
        }
    }

    render() {
        const props = this.props;

        let tagOptions = [];

        if (props.tagList && props.tagList.items) {
            tagOptions = props.tagList.items.reduce((options, item) => {
                options[item.data.id] = item.data.title;
                return options;
            }, {});
        }

        return (
            <AssignmentTemplate type="person_tag"
                messagePath="panes.addViewColumn.templates"
                selected={ props.selected }
                onSelect={ props.onSelect }
                >
                <SelectInput name="tag_id"
                    labelMsg="panes.addViewColumn.config.personTag.tag"
                    options={ tagOptions }
                    value={ props.config.tag_id }
                    onValueChange={ this.onConfigChange.bind(this) }
                    />
            </AssignmentTemplate>
        );
    }

    onConfigChange(attr, val) {
        const column = {
            config: Object.assign({}, this.props.config, {
                [attr]: val,
            })
        };

        const selectedTagItem = this.props.tagList.items
            .find(item => item.data.id == column.config.tag_id);

        column.title = selectedTagItem.data.title;

        this.props.onChange(column);
    }
}

@connect((state, props) => ({
    surveyList: state.surveys.surveyList,
    elementsBySurvey: state.surveys.elementsBySurvey,
}))
class SurveyResponseColumnTemplate extends React.Component {
    componentDidUpdate(prevProps) {
        // When selected, pick the first tag and propagate config
        /*
        if (this.props.selected && !prevProps.selected) {
            const { tagList } = this.props;

            if (tagList && tagList.items && tagList.items.length) {
                this.onConfigChange('tag_id', tagList.items[0].data.id);
            }
        }
        */

        const surveyId = this.props.config.survey_id;
        if (surveyId != prevProps.config.survey_id) {
            this.props.dispatch(retrieveSurvey(surveyId));
        }
    }

    render() {
        let surveyOptions = [];

        if (this.props.surveyList && this.props.surveyList.items) {
            surveyOptions = this.props.surveyList.items.reduce((options, item) => {
                options[item.data.id] = item.data.title;
                return options;
            }, {});
        }

        let questionSelect = null;

        const surveyId = this.props.config.survey_id;
        if (surveyId) {
            const elementList = this.props.elementsBySurvey[surveyId];
            if (elementList && elementList.items) {
                const questionOptions = elementList.items.reduce((options, item) => {
                    // Ignore text blocks and non-free-text questions
                    if (item.data.type == 'question' && item.data.question.response_type == 'text') {
                        options[item.data.id] = item.data.question.question;
                    }

                    return options;
                }, {});

                if (elementList && elementList.items) {
                    questionSelect = (
                        <SelectInput name="question_id"
                            labelMsg="panes.addViewColumn.config.surveyResponse.question"
                            nullOptionMsg="panes.addViewColumn.config.surveyResponse.questionNullOption"
                            options={ questionOptions }
                            value={ this.props.config.question_id }
                            onValueChange={ this.onConfigChange.bind(this) }
                            />
                    );
                }
            } else {
                questionSelect = <LoadingIndicator/>;
            }
        }

        return (
            <AssignmentTemplate type="survey_response"
                messagePath="panes.addViewColumn.templates"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }
                >
                <SelectInput name="survey_id"
                    labelMsg="panes.addViewColumn.config.surveyResponse.survey"
                    nullOptionMsg="panes.addViewColumn.config.surveyResponse.surveyNullOption"
                    options={ surveyOptions }
                    value={ this.props.config.survey_id }
                    onValueChange={ this.onConfigChange.bind(this) }
                    />
                { questionSelect }
            </AssignmentTemplate>
        );
    }

    onConfigChange(attr, val) {
        const column = {
            config: Object.assign({}, this.props.config, {
                [attr]: val,
            }),
            shouldShowButton: false,
        };

        if (column.config.survey_id && column.config.question_id) {
            const questionList = this.props.elementsBySurvey[column.config.survey_id];
            const selectedQuestionItem = questionList.items
                .find(item => item.data.id == column.config.question_id);
            column.shouldShowButton = true;
            column.title = selectedQuestionItem.data.question.question;
        }

        this.props.onChange(column);
    }
}
