import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default class SurveyTemplate extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected) {
            let surveys = nextProps.surveys;
            if (surveys && surveys.length && !nextProps.config.surveyId) {
                // Emit default configuration
                nextProps.onConfigChange({
                    surveyId: surveys[0].id.toString(),
                });
            }
        }
    }

    render() {
        let config = this.props.config;

        return (
            <AssignmentTemplate type="survey"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }>
                <select name="survey" value={ config.surveyId }
                    onChange={ this.onChange.bind(this) }>
                { this.props.surveys.map(c => (
                    <option key={ c.id } value={ c.id.toString() }>
                        { c.title }
                    </option>
                )) }
                </select>
            </AssignmentTemplate>
        );
    }

    onChange(ev) {
        if (this.props.onConfigChange) {
            this.props.onConfigChange({
                surveyId: ev.target.value,
            });
        }
    }
}
